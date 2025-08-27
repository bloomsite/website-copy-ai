from django.contrib import admin
from .models import Form, FormField, FormSection, FormSubmission

# Register your models here.
@admin.register(Form)
class FormAdmin(admin.ModelAdmin):
    readonly_fields = ('form_id', 'form_sections')

    @admin.display(description="Form Sections")
    def form_sections(self, obj):
        return obj.sections if obj.sections is not None else 'not found nigga'

@admin.register(FormSection)
class FormSectionAdmin(admin.ModelAdmin):
    readonly_fields = ('form_id', 'form_title')
    list_display = ['title', 'form_title']
    fields = ['title', 'description', 'form', 'form_id', 'form_title', 'is_repeatable', 'repeatable_count']
    
    @admin.display(description="Form Title")
    def form_title(self, obj):
        return obj.form.title if obj.form_id else "—"


@admin.register(FormField)
class FormFieldAdmin(admin.ModelAdmin):
    pass 

@admin.register(FormSubmission)
class FormSubmissionAdmin(admin.ModelAdmin):
    pass 
