from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import datetime 

import uuid 

# Create your models here.
class Role(models.TextChoices):
    ADMIN = 'admin', 'Administrator'
    CLIENT = 'client', 'Client'

class User(AbstractUser):
    role = models.CharField(
        max_length=16,
        choices=Role.choices,
        default=Role.CLIENT,
    )

    # Common information for all users
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=128, blank=False)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)

    # Additional information for all users
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)

    # Unique identifier for each user
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    is_password_set = models.BooleanField(default=False)
    # Custom fields
    joined_date = models.DateField(default=timezone.now)
    tokens_used = models.IntegerField(default=0)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    
    # Onboarding fields
    has_completed_onboarding = models.BooleanField(default=False)

    # Override the username field to use email
    def save(self, *args, **kwargs):
        if self.username:
            self.email = self.username
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email
    
class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.expires_at:
            # Token is na 30 dagen niet meer bruikbaar
            self.expires_at = self.created_at + datetime.timedelta(days=30)
        super().save(*args, **kwargs)

    def is_valid(self):
        return not self.is_used and self.expires_at > timezone.now()
    
    def __str__(self):
        return f"Reset token belonging to {self.user}"

