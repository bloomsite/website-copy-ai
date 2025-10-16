from django.shortcuts import get_object_or_404
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from .services.cosmosdb import update_user_profile

from .models import User, Role
from .serializers import SetPasswordSerializer

class SetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):

        data: dict = self.request.data 

        serializer_data = {
            'password': data['password'], 
            'confirm_password': data['confirm_password'], 
            'token': data['token']
        }

        serializer = SetPasswordSerializer(serializer_data)
        if not serializer.is_valid():
            return Response(serializer.error, status=400)

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
        data['uuid'] = self.user.uuid

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
        

class UserListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user

        if user.role != Role.ADMIN:
            return Response({"error": "You do not have permission to view this resource."}, status=status.HTTP_403_FORBIDDEN)

        users = User.objects.all()

        user_role = request.query_params.get('role', None)
        if user_role:
            users = users.filter(role=user_role)

        user_id = request.query_params.get('id', None)
        if user_id:
            try:
                users = [User.objects.get(uuid=user_id)]
            except User.DoesNotExist:
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        first_name = request.query_params.get('first_name', None)
        if first_name:
            users = users.filter(first_name__icontains=first_name)

        last_name = request.query_params.get('last_name', None)
        if last_name:
            users = users.filter(last_name__icontains=last_name)

        email = request.query_params.get('email', None)
        if email:
            users = users.filter(email__icontains=email)

        user_data: list[dict] = [
            {
                "id": str(user.uuid),
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
                "date_joined": user.date_joined.isoformat(),
                "last_login": user.last_login.isoformat() if user.last_login else None
            } for user in users
        ]

        return Response(user_data, status=status.HTTP_200_OK)
    
class UserDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user 

        if user.role != Role.ADMIN:
            return Response({"error": "You do not have permission to view this resource."}, status=status.HTTP_403_FORBIDDEN)
        
        
        user_id = request.query_params.get('user_id')


        if not user_id:
            return Response({"error":"a user_id must be provided"}, status=400)
        
        try:
            user = get_object_or_404(User, uuid=user_id)
            # Get all form submissions for the user
            forms = user.submissions.all().select_related('form')

            forms_data = [
                {
                    "submissionId": str(form.id),
                    "formId": str(form.form.form_id),
                    "formName": form.form_name,
                    "formVersion": str(form.form.version),
                    "submittedAt": form.submitted_at.isoformat(),
                    "formData": form.form_data,
                }
                for form in forms
            ]

            user_data = {
                "firstName": user.first_name,
                "lastName": user.last_name, 
                "email": user.email, 
                "uuid": user.uuid, 
                "dateJoined": user.date_joined, 
                "lastLogin": user.last_login, 
                "companyName": user.company_name, 
                "formsFilled": forms_data
            }
            return Response(user_data, status=200)
        except Exception as e:
            return Response({"error": f"an error occured {e}"}, status=500)
        

from django.utils import timezone
class AuthenticationStatusView(APIView):
    permission_classes = [permissions.AllowAny] 
    def get(self, request):
        """
        Comprehensive authentication status check for debugging
        """
        response_data = {
            'timestamp': timezone.now().isoformat(),
            'request_info': {
                'method': request.method,
                'path': request.path,
                'user_agent': request.META.get('HTTP_USER_AGENT', 'Unknown'),
                'remote_addr': request.META.get('REMOTE_ADDR', 'Unknown'),
            },
            'session_info': {
                'session_key': request.session.session_key,
                'session_data': dict(request.session.items()) if hasattr(request.session, 'items') else {},
                'is_empty': request.session.is_empty() if hasattr(request.session, 'is_empty') else True,
            },
            'user_info': {
                'is_authenticated': request.user.is_authenticated,
                'is_anonymous': request.user.is_anonymous,
                'username': getattr(request.user, 'username', 'Anonymous'),
                'user_id': getattr(request.user, 'id', None),
                'first_name': getattr(request.user, 'first_name', ''),
                'last_name': getattr(request.user, 'last_name', ''),
                'email': getattr(request.user, 'email', ''),
                'role': getattr(request.user, 'role', None),
                'is_active': getattr(request.user, 'is_active', False),
                'is_staff': getattr(request.user, 'is_staff', False),
                'is_superuser': getattr(request.user, 'is_superuser', False),
                'date_joined': getattr(request.user, 'date_joined', None),
                'last_login': getattr(request.user, 'last_login', None),
            },
            'token_info': {
                'has_auth_header': 'HTTP_AUTHORIZATION' in request.META,
                'auth_header': request.META.get('HTTP_AUTHORIZATION', 'Not provided'),
                'token_valid': False,
                'token_error': None,
                'token_user_id': None,
                'token_exp': None,
                'token_type': None,
            },
            'cookies': {
                'csrftoken': request.COOKIES.get('csrftoken', 'Not found'),
                'sessionid': request.COOKIES.get('sessionid', 'Not found'),
                'all_cookies': list(request.COOKIES.keys()),
            },
            'csrf_info': {
                'csrf_token': request.META.get('CSRF_COOKIE', 'Not found'),
                'csrf_processing_view': getattr(request, 'csrf_processing_done', False),
            }
        }

        # JWT Token Analysis
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            try:
                from rest_framework_simplejwt.tokens import AccessToken
                access_token = AccessToken(token)
                
                response_data['token_info'].update({
                    'token_valid': True,
                    'token_user_id': access_token.get('user_id'),
                    'token_exp': access_token.get('exp'),
                    'token_type': access_token.get('token_type'),
                    'token_jti': access_token.get('jti'),
                    'token_iat': access_token.get('iat'),
                })
                
                # Try to get user from token
                try:
                    token_user = User.objects.get(id=access_token['user_id'])
                    response_data['token_info']['token_user_exists'] = True
                    response_data['token_info']['token_user_data'] = {
                        'id': token_user.id,
                        'username': token_user.username,
                        'email': token_user.email,
                        'first_name': token_user.first_name,
                        'role': token_user.role,
                        'is_active': token_user.is_active,
                    }
                except User.DoesNotExist:
                    response_data['token_info']['token_user_exists'] = False
                    
            except Exception as e:
                response_data['token_info'].update({
                    'token_valid': False,
                    'token_error': str(e),
                })

        # Add permissions info
        response_data['permissions_info'] = {
            'view_permission_classes': [cls.__name__ for cls in self.permission_classes],
            'user_permissions': list(request.user.get_all_permissions()) if request.user.is_authenticated else [],
            'user_groups': list(request.user.groups.values_list('name', flat=True)) if request.user.is_authenticated else [],
        }

        # Environment info (be careful with sensitive data)
        response_data['environment_info'] = {
            'debug_mode': settings.DEBUG,
            'jwt_access_token_lifetime': str(settings.SIMPLE_JWT.get('ACCESS_TOKEN_LIFETIME', 'Not set')),
            'jwt_refresh_token_lifetime': str(settings.SIMPLE_JWT.get('REFRESH_TOKEN_LIFETIME', 'Not set')),
            'cors_allow_all_origins': getattr(settings, 'CORS_ALLOW_ALL_ORIGINS', False),
            'cors_allow_credentials': getattr(settings, 'CORS_ALLOW_CREDENTIALS', False),
        }

        return Response(response_data, status=status.HTTP_200_OK)

