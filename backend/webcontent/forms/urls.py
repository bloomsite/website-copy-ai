from django.urls import path
from .views import PublicFormsView, FormsOverviewView, FormDetailView

urlpatterns = [
    path("public-forms", PublicFormsView.as_view(),name="public forms"),
    path("forms-overview", FormsOverviewView.as_view(),name="public forms"),
    path("<str:form_id>", FormDetailView.as_view(),name="public forms"),
]