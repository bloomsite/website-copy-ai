from django.db import models

# Create your models here.
class ContentRequest(models.Model):
    request_data = models.JSONField()