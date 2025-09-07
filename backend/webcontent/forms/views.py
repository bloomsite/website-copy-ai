import json 

from django.conf import settings
from django.shortcuts import get_object_or_404
from django.utils import timezone 
from django.contrib.auth import get_user_model
from azure.cosmos import CosmosClient, exceptions as CosmosExceptions 

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from rest_framework_simplejwt.authentication import JWTAuthentication

from typing import Any, Dict, List

from .models import Form, FormSubmission

def _container_form_definitions():
    client = CosmosClient(
        settings.COSMOS["ENDPOINT"], 
        credential=settings.COSMOS["KEY"]
        )
    
    db = client.get_database_client(settings.COSMOS["DATABASE_FORM_DATA"])
    return db.get_container_client(settings.COSMOS["CONTAINER_FORM_DEFINITIONS"])


def make_progression_id(user_id: str, form_id: str, form_version: str):
    """
    This function makes the progression id based on the request information. The document ID is composed of the following: 
    user_id (UUID), form_id and form version
    Returned user:{user_id}form:{fomr_id}version:{form_version}
    """
    pk_user_id = f"user:{user_id}"
    doc_id = f"form:{form_id}version{form_version}"
    return pk_user_id, doc_id


class PublicFormsView(APIView):
    def get(self, request):
        c = _container_form_definitions()
        items = list(c.query_items(
            """
            SELECT c.formId, c.title, c.version
            FROM c
            WHERE c.type = 'FormDefinition' AND c.isActive = true
            ORDER BY c.title
            """,
            enable_cross_partition_query=True
        ))
        return Response(items)
    
class FormsOverviewView(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        forms = (Form.objects
                 .filter(is_active=True)
                 .only(
                       "form_id", 
                       "title",
                       "description", 
                       "short_description", 
                       "icon", 
                       "version"
                       )
                 .order_by("order", "form_id"))
        
        items = [
            {
                "formId": f.form_id,
                "title": f.title,
                "icon": f.icon, 
                "description": f.description,
                "shortDescription": f.short_description,
                "version": str(f.version),
            }
            for f in forms 
        ]

        return Response(items)

class FormDetailView(APIView):
    permission_classes = []
    authentication_classes = []


    def get(self, request, form_id):
        form = (Form.objects
                .filter(form_id=form_id, is_active=True)
                .order_by('version')
                .first())

        if not form:
            return Response({"detail": "Form not found."}, status=status.HTTP_404_NOT_FOUND)
        
        sections_data: List[Dict[str, Any]] = []
        for section in form.sections.all():
            fields: List[Dict[str, Any]] = [
                {
                "label": field.label, 
                "description": field.description, 
                "type": field.field_type, 
                "required": field.is_required, 
                "placeholder": field.placeholder, 
                "options": field.options, 
                }
                for field in section.fields.all()
            ]
            sections_data.append({
                "title": section.title, 
                "description": section.description,
                "isRepeatable": section.is_repeatable,
                "repeatableCount": section.repeatable_count, 
                "fields": fields
            })

        item = {
            "formId": form.form_id,
            "title": form.title,
            "icon": form.icon,
            "description": form.description,
            "sections": sections_data,
            "shortDescription": form.short_description,
            "version": str(form.version),
        }
        return Response(item)
    
class FormSubmitView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]


    def post(self, request, *args, **kwargs):
            
        user = request.user 
        data: Dict = request.data 

        form_answers: Dict = data.get("answers")
        form_id = data.get("formId")
        form_name = data.get("formName")

        if not user.is_authenticated:
            return Response({"error": "user isn't authenticated"}, status=401)

        if form_id is None:
            return Response({"error": "The form id can't be None"}, status=400)
        
        if form_name is None:
            return Response({"error":"Submitted form must include a name"})

        if not form_answers:
            return Response({"error": "request must include answers"}, status=400)
        
        try:
            form = get_object_or_404(Form, form_id=form_id)
            submitted_form = FormSubmission.objects.create(
                user = request.user, 
                form = form, 
                form_name = form_name,
                form_data = form_answers, 
            )

            submitted_form.save()
        except json.JSONDecodeError:
            return Response({"error":"invalid JSON format"}, status=400)
            
        return Response({"response": "succeeded"}, status=200)
    
class UserFormSubmissionsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        request_user_uuid = request.user.uuid

        User = get_user_model()
        user = get_object_or_404(User, uuid=request_user_uuid)

        submissions = FormSubmission.objects.filter(user=user).order_by('-submitted_at')
        
        submissions_data = [{
            "submissionId": str(submission.id),
            "formId": submission.form.form_id,
            "formName": submission.form_name,
            "formVersion": str(submission.form.version),
            "submittedAt": submission.submitted_at.isoformat(),
            "formData": submission.form_data
        } for submission in submissions]

        return Response(submissions_data, status=status.HTTP_200_OK)
    

def _container_form_progression():
    client = CosmosClient(
        settings.COSMOS["ENDPOINT"], 
        credential=settings.COSMOS["KEY"]
    )

    db = client.get_database_client(settings.COSMOS["DATABASE_USER_DATA"])
    return db.get_container_client(settings.COSMOS["CONTAINER_FORM_PROGRESSION"])

def make_progression_id(user_id: str, form_id: str, form_version: str):
    """
    This function makes the progression id based on the request information. The document ID is composed of the following: 
    user_id (UUID), form_id and form version
    Returned user:{user_id}form:{fomr_id}version:{form_version}
    """
    pk_user_id = f"user:{user_id}"
    doc_id = f"form:{form_id}version{form_version}"
    return pk_user_id, doc_id

class FormProgressionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs): 
        
        user_id = request.user.uuid
        form_id = request.query_params.get('formId')
        version = request.query_params.get('formVersion')
        pk, doc_id = make_progression_id(user_id=user_id, form_id=form_id, form_version=version)

        try: 
            c = _container_form_progression()
            doc = c.read_item(item=doc_id, partition_key=pk)

            answers = doc['answers']

            return Response(
                {"answers": answers,
                 "updatedAt": doc.get("updatedAt")},
                status=200
            )
        except CosmosExceptions.CosmosResourceNotFoundError as e:
            return Response({"detail":"the requsted resource was not found"}, status=404)
        except CosmosExceptions.CosmosAccessConditionFailedError as e:
            return Response({"detail":f"Access Condition Failed: {e}"}, status=505)
        except Exception as e: 
            return Response({"error": f"and unknown error occured: {e}"}, status=500)

    def put(self, request, *args, **kwargs): 
        user_id = str(request.user.uuid)
        request_body: Dict = request.data 

        if request_body is None: 
            return Response({"error":"request body returns None type"}, status=400)
        
        form_id = request_body.get("formId")
        if not form_id:
            return Response({"error":"form id must be included in request body"}, status=400)
        
        version = request_body.get("formVersion")
        if not version:
            return Response({"error":"version must be included in request body"}, status=400)
        if not isinstance(version, str):
            return Response({"error":"version must be a string instance"}, status=400)
        
        answers = request_body.get("answers", {})
        if not isinstance(answers, dict):
            return Response({"error": "request body must include answers in dict"}, status=400)
        
        pk, doc_id = make_progression_id(user_id=user_id, form_id=form_id, form_version=version)
        doc = {
            "id": doc_id,
            "userId": pk, 
            "formId": form_id, 
            "formVersion": version, 
            "answers": answers, 
            "updatedAt": f"{timezone.localtime()}"
        }

        try: 
            c = _container_form_progression()
            c.upsert_item(doc)
            return Response({"detail":f"updated {doc_id}"}, status=200)
        except Exception as e: 
            return Response({"error": f"{e}"}, status=500)







