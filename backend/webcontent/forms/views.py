from django.shortcuts import render
from django.conf import settings
from azure.cosmos import CosmosClient

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from typing import Any, Dict, List

from .models import Form, FormSection, FormField

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


