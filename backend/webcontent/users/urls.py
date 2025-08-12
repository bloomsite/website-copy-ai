from django.urls import path
from .views import RegisterClient, LoginView, LogoutView, UserOnboardingView, UserListView


urlpatterns = [
    # Authentication
    path('register/', RegisterClient.as_view(), name='register_user'),
    path('token/', LoginView.as_view(), name='token_obtain_pair'),
    path('logout/', LogoutView.as_view(), name='logout_user'),
    path('onboarding/', UserOnboardingView.as_view(), name='user_onboarding'),

    # User management
    path('fetch/', UserListView.as_view(), name='fetch_users'),
]