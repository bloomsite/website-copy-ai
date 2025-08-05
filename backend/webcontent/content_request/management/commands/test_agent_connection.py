from django.core.management.base import BaseCommand
from rest_framework.response import Response
from rest_framework import status

from content_request.serializers import GenerateContentSerializer
from content_request.views import generate_content_with_agent
from content_request.services.azure_agent import AgentError

class Command(BaseCommand):
    help = "Test the connection to the Azure Foundry Agent."

    def handle(self, *args, **kwargs):
        sample_payload = {
            "tone": "persuasive",
            "audience": "jongeren",
            "goal": "educate-audience",
            "description": (
                "vertel jongeren waarom het belangrijk is dat ze elke avond 8 uur slaap krijgen om er zo voor te zorgen dat ze optimaal fit zijn voor de opeenvolgende dag zodat ze altijd goed voelen"
            ),
            "pageType": "home",
        }

        serializer = GenerateContentSerializer(data=sample_payload)
        serializer.is_valid(raise_exception=True)
        
        try:
            self.stdout.write(self.style.NOTICE("🚀 Sending to Azure AI Foundry agent..."))
            content = generate_content_with_agent(serializer.validated_data)
            self.stdout.write(self.style.SUCCESS("✅ Received content from agent:\n"))
            self.stdout.write(content)
        except AgentError as e:
            self.stderr.write(self.style.ERROR(f"❌ AgentError: {e}"))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"❌ Unexpected error: {e}"))
