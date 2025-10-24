from django.urls import path

from .views import (AvailableFormsOverviewView, ConfirmsOverviewView,
                    DeleteUserFormView, FormConfirmView, FormDetailView,
                    FormProgressionView, FormsOverviewView,
                    FormSubmissionsView, FormSubmitView, UploadFormImageView,
                    UserFormSubmissionsView)

urlpatterns = [
    path("forms-overview", FormsOverviewView.as_view(),name="public forms"),
    path("available-forms-overview", AvailableFormsOverviewView.as_view(), name="avalable forms overview"),
    path("confirms-overview", ConfirmsOverviewView.as_view(),name="public forms"),
    path("<str:form_id>", FormDetailView.as_view(),name="public forms"),
    path("progress/", FormProgressionView.as_view(), name="form progression" ),
    path("submit/", FormSubmitView.as_view(), name="submit form" ),
    path("delete/", DeleteUserFormView.as_view(), name="delete form"),
    path("submissions/", FormSubmissionsView.as_view(), name="submitted forms"),
    path("submission/", UserFormSubmissionsView.as_view(), name="user submitted forms"),
    path("upload-image/", UploadFormImageView.as_view(), name="upload image view"),
    path("confirm/", FormConfirmView.as_view(), name="confirm form"),
]