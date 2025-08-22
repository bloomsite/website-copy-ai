import logging 

from typing import Dict, Any
from django.utils.text import slugify
from forms.models import Form, FormField, FormSection


logger = logging.getLogger(__name__)


def build_form_definition(form: Form) -> Dict[str, Any]:
    """
    Creates a denormalized FormDefinition doc from Form → Sections → Fields.
    Stored in ONE Cosmos container with partition key '/pk'.
    """
    version_str = str(form.version)
    doc_id = f"form_def_{form.pk}_v{version_str}"
    title_slug = slugify(form.title) or f"form-{form.pk}"
    form_id = form.form_id
    is_active = form.is_active

    form_with_related = (
        Form.objects.filter(pk=form.pk)
        .prefetch_related("sections__fields")
        .select_related("created_by")
        .first()
    )

    sections: list[Dict[str, Any]] = []
    for section in form_with_related.sections.all().order_by("order"):
        fields = []
        for field in section.fields.all().order_by("order"):
            fields.append({
                "id": slugify(field.label) or f"field-{field.pk}",
                "label": field.label,
                "fieldType": _map_field_type(field.field_type),
                "isRequired": field.is_required,
                "placeholder": field.placeholder or "",
                "options": field.options or [],
                "order": field.order,
            })
            sections.append({
                "id": slugify(section.title) or f"section-{section.pk}",
                "title": section.title,
                "description": section.description or "",
                "fields": fields,
            })


    # Create the final document structure
    doc =  {
        # Identity 
        "type": "FormDefinition",
        "slug": title_slug,
        "id": doc_id,
        "isActive": is_active, 
        "formId": form_id,
        # Metadata
        "title": form.title,
        "version": version_str,
        "description": form.description or "",
        "createdBy": form.created_by.username,
        "createdAt": form.created_at.isoformat(),
        "updatedAt": form.updated_at.isoformat(),
        "sections": sections,
    }

    return doc 


def _map_field_type(ft: str) -> str:
    return {
        "text": "text",
        "text_area": "textarea",
        "email": "text",           # validate email on the frontend
        "multiselect": "multiselect",
        "select": "select",
        "select_few": "multiselect",
    }.get(ft, "text")
