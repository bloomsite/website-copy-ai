from django.urls import path
from .views import FormsOverviewView, FormDetailView, FormSubmitView, UserFormSubmissionsView, FormProgressionView, DeleteUserFormView, UploadFormImageView, FormConfirmView, ConfirmsOverviewView

urlpatterns = [
    path("forms-overview", FormsOverviewView.as_view(),name="public forms"),
    path("confirms-overview", ConfirmsOverviewView.as_view(),name="public forms"),
    path("<str:form_id>", FormDetailView.as_view(),name="public forms"),
    path("progress/", FormProgressionView.as_view(), name="form progression" ),
    path("submit/", FormSubmitView.as_view(), name="submit form" ),
    path("delete/", DeleteUserFormView.as_view(), name="delete form"),
    path("submissions/", UserFormSubmissionsView.as_view(), name="submitted forms"),
    path("upload-image/", UploadFormImageView.as_view(), name="upload image view"),
    path("confirm/", FormConfirmView.as_view(), name="confirm form"),
]