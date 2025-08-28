import json 

from django.shortcuts import get_object_or_404
from django.conf import settings
from django.contrib.auth import get_user_model
from azure.cosmos import CosmosClient

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from rest_framework_simplejwt.authentication import JWTAuthentication

from typing import Any, Dict, List

from .models import Form, FormSubmission

def _container():
    client = CosmosClient(
        settings.COSMOS["ENDPOINT"], 
        credential=settings.COSMOS["KEY"]
        )
    
    db = client.get_database_client(settings.COSMOS["DATABASE_FORM_DATA"])
    return db.get_container_client(settings.COSMOS["CONTAINER_FORM_DEFINITIONS"])

class PublicFormsView(APIView):
    def get(self, request):
        c = _container()
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




