from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterClient, LoginView, LogoutView, UserOnboardingView, UserListView, UserDetailView, AuthenticationStatusView, InviteClient, SetPasswordView



urlpatterns = [
    # Authentication
    path('register/', RegisterClient.as_view(), name='register_user'),
    path('token/', LoginView.as_view(), name='token obtain pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token obtain refresh'),
    path('logout/', LogoutView.as_view(), name='logout_user'),

    #Password Authentication and Invitations
    path("invite/", InviteClient.as_view(), name="invite user"),
    path("set-password/", SetPasswordView.as_view(), name="set password"),

    # onboarding
    path('onboarding/', UserOnboardingView.as_view(), name='user_onboarding'),

    # User management
    path('fetch/', UserListView.as_view(), name='fetch_users'),
    path('fetch/user/', UserDetailView.as_view(), name="fetch user detail"),
    path('me/', AuthenticationStatusView.as_view())
]