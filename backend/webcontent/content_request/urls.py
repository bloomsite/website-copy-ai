from django.urls import path
from .views import GenerateContentView  # adjust import if placed in an app

urlpatterns = [
    path("generate-content", GenerateContentView.as_view(), name="generate-content"),
]