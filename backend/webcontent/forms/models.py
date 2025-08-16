from django.db import models
from django.contrib.auth import get_user_model 
from django.utils.text import slugify

User = get_user_model()

# Create your models here.
class Form(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    version = models.CharField(max_length=50, default='1.0')
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='forms', null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Form'
        verbose_name_plural = 'Forms'

    def __str__(self):
        return self.title


class FormSection(models.Model):
    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)
    description = models.TextField(blank=True)

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
        ('text', 'Text'),
        ('text_area', 'Text Area'),
        ('email', 'Email'),
        ('multiselect', 'Multi-select'),
        ('select', 'Select'),
        ('select_few', 'Select Few'),
    )

    label = models.CharField(max_length=255)
    field_type = models.CharField(max_length=50, choices=FIELD_TYPES)
    is_required = models.BooleanField(default=False)
    placeholder = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    options = models.JSONField(default=list, null=True, blank=True) 

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

    

