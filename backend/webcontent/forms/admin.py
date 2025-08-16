from django.contrib import admin
from .models import Form, FormField, FormSection

# Register your models here.
admin.site.register(Form)
admin.site.register(FormField)
admin.site.register(FormSection)
