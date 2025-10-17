from django.contrib import admin
from .models import User, PasswordResetToken

# Register your models here.
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'uuid', 'first_name', 'last_name']
    search_fields = ['email', 'first_name', 'last_name', 'uuid']
    
@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ['user__email', 'created_at', 'expires_at', 'is_used']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    readonly_fields = ['token', 'user']