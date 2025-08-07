from django.urls import path
from .views import RegisterClient, LoginView, LogoutView, OnboardingView


urlpatterns = [
    path('register/', RegisterClient.as_view(), name='register_user'),
    path('token/', LoginView.as_view(), name='token_obtain_pair'),
    path('logout/', LogoutView.as_view(), name='logout_user'),
    path('onboarding/', OnboardingView.as_view(), name='user_onboarding'),
]