from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework import status 

from .serializers import GenerateContentSerializer
from .services.azure_agent import generate_content_with_agent, AgentError



# Create your views here.
class GenerateContentView(APIView):
    # Add authentication/permission classes here if needed
    def post(self, request):
        serializer = GenerateContentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            content = generate_content_with_agent(data)
        except AgentError as e:
            return Response({"detail": str(e)}, status=status.HTTP_502_BAD_GATEWAY)
        except Exception as e:
            return Response({"detail": "Unexpected error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(
            {
                "input": data,
                "content": content,
            },
            status=status.HTTP_200_OK,
        )