from django.contrib import admin
from .models import Form, FormField, FormSection, FormSubmission

# Register your models here.
@admin.register(Form)
class FormAdmin(admin.ModelAdmin):
    readonly_fields = ('form_id', 'form_sections')

    @admin.display(description="Form Sections")
    def form_sections(self, obj):
        return obj.sections if obj.sections is not None else 'not found'

@admin.register(FormSection)
class FormSectionAdmin(admin.ModelAdmin):
    readonly_fields = ('form_id', 'form_title')
    list_display = ['title', 'form_title']
    fields = ['title', 'description', 'form', 'form_id', 'form_title', 'is_repeatable', 'repeatable_count', 'order']
    
    @admin.display(description="Form Title")
    def form_title(self, obj):
        return obj.form.title if obj.form_id else "—"


@admin.register(FormField)
class FormFieldAdmin(admin.ModelAdmin):
    list_display = ['label', 'form_section_display', 'field_type', 'is_required', 'order']
    list_filter = ['form_section__form', 'form_section', 'field_type', 'is_required']
    search_fields = ['label', 'description', 'form_section__title']
    ordering = ['form_section__form', 'form_section', 'order']

    @admin.display(description="Form Section")
    def form_section_display(self, obj):
        if obj.form_section:
            return f"{obj.form_section.form.title} - {obj.form_section.title}"
        return "—"

@admin.register(FormSubmission)
class FormSubmissionAdmin(admin.ModelAdmin):
    list_filter = ['user', 'form_name']
    search_fields = ['user', 'form_name']
    list_display = ['user', 'form_name']


# comment for commit 