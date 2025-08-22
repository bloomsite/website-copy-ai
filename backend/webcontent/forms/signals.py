from functools import partial 
import logging

from django.db.models.signals import post_save, post_delete 
from django.db import transaction
from django.dispatch import receiver

from .models import Form, FormSection, FormField
from .services.cosmos_builder import build_form_definition
from .services.cosmos_client import upsert_item 

logger = logging.getLogger(__name__)


def sync_form_to_cosmos(form_id: int) -> None:
    """
    Sync a form instance to Cosmos DB.
    """
    form = Form.objects.filter(form_id=form_id).first()
    if not form:
        return 
    
    doc = build_form_definition(form)

    upsert_item(doc)

def delete_form_from_cosmos(form_id: int) -> None:
    """
    Delete a form instance from Cosmos DB
    """
    pass 

@receiver(post_save, sender=Form)
def _form_saved(sender, instance: Form, created: bool, **kwargs) -> None:
    """
    Signal receiver for form save events.
    """
    if instance.form_id:
        transaction.on_commit(partial(sync_form_to_cosmos, instance.form_id))


# Finish these up later when confirmed that it works
@receiver(post_delete, sender=Form)
def _form_deleted(sender, instance: Form, **kwargs):
    transaction.on_commit(partial(delete_form_from_cosmos, instance))

@receiver(post_save, sender=FormSection)
def _section_saved(sender, instance: FormSection, **kwargs):
    if instance.form_id:
        logger.warning(f"⛔️ FORM SECTION POST_SAVE TRIGGERED \n This is instance form id: {instance.form_id}")
        transaction.on_commit(lambda: sync_form_to_cosmos(instance.form_id))

@receiver(post_delete, sender=FormSection)
def _section_deleted(sender, instance: FormSection, **kwargs):
    if instance.form_id:
        transaction.on_commit(lambda: sync_form_to_cosmos(instance.form_id))

@receiver(post_save, sender=FormField)
def _field_saved(sender, instance: FormField, **kwargs):
    if instance.form_section and instance.form_section.form_id:
        fid = instance.form_section.form_id
        transaction.on_commit(lambda: sync_form_to_cosmos(fid))

@receiver(post_delete, sender=FormField)
def _field_deleted(sender, instance: FormField, **kwargs):
    if instance.form_section and instance.form_section.form_id:
        fid = instance.form_section.form_id
        transaction.on_commit(lambda: sync_form_to_cosmos(fid))


from django.utils import timezone  # not strictly needed; auto_now handles updated_at

def _touch_parent(form_id: str):
    def _cb():
        try:
            form = Form.objects.get(form_id=form_id)
            form.save(update_fields=["updated_at"])  # triggers Form.post_save once
        except Form.DoesNotExist:
            pass
    return _cb

@receiver(post_save, sender=FormSection)
def _section_saved(sender, instance: FormSection, **kwargs):
    if instance.form_id:
        transaction.on_commit(_touch_parent(instance.form_id))

@receiver(post_delete, sender=FormSection)
def _section_deleted(sender, instance: FormSection, **kwargs):
    if instance.form_id:
        transaction.on_commit(_touch_parent(instance.form_id))

@receiver(post_save, sender=FormField)
def _field_saved(sender, instance: FormField, **kwargs):
    if instance.form_section and instance.form_section.form_id:
        transaction.on_commit(_touch_parent(instance.form_section.form_id))

@receiver(post_delete, sender=FormField)
def _field_deleted(sender, instance: FormField, **kwargs):
    if instance.form_section and instance.form_section.form_id:
        transaction.on_commit(_touch_parent(instance.form_section.form_id))
