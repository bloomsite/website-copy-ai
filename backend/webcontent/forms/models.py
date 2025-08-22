import uuid
from django.db import models
from django.contrib.auth import get_user_model 
from django.utils.text import slugify

User = get_user_model()

def generate_form_id(title) -> str:
    """
    Generate a unique form ID based on the form's title and primary key.
    """
    slug = slugify(title)[:30]  # truncate to avoid overly long keys
    short_uuid = str(uuid.uuid4())[:8]  # 8-char slice of UUID
    return f"{slug}-{short_uuid}"


class Form(models.Model):
    form_id = models.CharField(max_length=100, unique=True, editable=False)
    title = models.CharField(max_length=255)
    version = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)

    description = models.TextField(blank=True)
    short_description = models.TextField(blank=True)
    icon = models.CharField(max_length=255, default="settings")
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='forms', null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Form'
        verbose_name_plural = 'Forms'

    def save(self, *args, **kwargs):
        # Only generate form_id once (immutable)
        if not self.form_id:
            self.form_id = generate_form_id(self.title)
        else:
            self.version += 1 
        super().save(*args, **kwargs)
    

    def __str__(self):
        return self.title


class FormSection(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    order = models.PositiveIntegerField(default=0)
    
    form = models.ForeignKey(
        Form, 
        on_delete=models.CASCADE, 
        related_name='sections',
        null=True,
        blank=True
    )

    class Meta:
        verbose_name = 'Form Section'
        verbose_name_plural = 'Form Sections'
        ordering = ['order']

    def __str__(self):
        return self.title
    
class FormField(models.Model):
    FIELD_TYPES = (
        ('text_field', 'Text Field'),
        ('text_area', 'Text Area'),
        ('email', 'Email'),
        ('multiselect', 'Multi-select'),
        ('select', 'Select'),
        ('select_few', 'Select Few'),
    )

    label = models.CharField(max_length=255)
    description = models.CharField(max_length=255, blank=True)
    field_type = models.CharField(max_length=50, choices=FIELD_TYPES)
    is_required = models.BooleanField(default=False)
    placeholder = models.CharField(max_length=255, blank=True)
    options = models.JSONField(default=list, null=True, blank=True) 

    order = models.PositiveIntegerField(default=0)

    form_section = models.ForeignKey(
        FormSection, 
        on_delete=models.CASCADE, 
        related_name='fields',
        null=True,
        blank=True
    )

    class Meta:
        verbose_name = 'Form Field'
        verbose_name_plural = 'Form Fields'
        ordering = ['order']

    def __str__(self):
        return self.label

    

