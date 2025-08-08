from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from .services.cosmosdb import update_user_profile

from .models import User, Role

class UserOnboardingView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        
        data = request.data
        user = request.user 

        user.has_completed_onboarding = True
        
        user_data = {
            "id": str(user.uuid), 
            "userId": str(user.uuid), 
            "firstName": user.first_name,
            "lastName": user.last_name,
            "companyName": user.company_name,
            "companyType": data.get("companyType"),
            "companyGoal": data.get("companyGoal"),
            "targetAudience": data.get("targetAudience")
        }

        try:
            update_user_profile(user_data)
        except Exception as e:
            return Response(
                {"detail": f"Failed to insert data into Cosmos DB: {str(e)}"},
                status=status.HTTP_502_BAD_GATEWAY
            )

        return Response({"detail": "User profile saved successfully."}, status=status.HTTP_200_OK)


# Create your views here.
class RegisterClient(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.data
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return Response({"error": "User with this email already exists"}, status=status.HTTP_400_BAD_REQUEST)

        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')
        company_name = data.get('company_name', '')

        # Create the user
        user = User(
            email=email,
            username=email,
            first_name=first_name,
            last_name=last_name,
            company_name=company_name,
            role=Role.CLIENT
        )

        user.set_password(password)
        user.save()

        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

# This is the login view 
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    permission_classes = [permissions.AllowAny]

    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add custom claims
        data['role'] = self.user.role
        data['email'] = self.user.email
        data['name'] = self.user.first_name
        data['id'] = self.user.id

        return data
    
class LoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

# logout view 
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            if (refresh_token): 
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response({'success': 'User logged out'}, status=status.HTTP_200_OK)
            else:
                return Response({'succes': 'User logged out, no refresh token'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        