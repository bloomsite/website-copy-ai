from django.core.management.base import BaseCommand
from azure.cosmos import CosmosClient, exceptions
from django.conf import settings
import uuid

class Command(BaseCommand):
    help = 'Inserts a user profile into Azure Cosmos DB'

    def add_arguments(self, parser):
        parser.add_argument('--userId', type=str, help='The user ID (partition key)')
        parser.add_argument('--companyType', type=str, help='Company type', default='Sole Proprietorship')
        parser.add_argument('--goal', type=str, help='User goal', default='Generate website content')

    def handle(self, *args, **options):
        user_id = options['userId'] or str(uuid.uuid4())  # fallback to random UUID
        company_type = options['companyType']
        goal = options['goal']

        try:
            client = CosmosClient(
                settings.AZURE_COSMOS_ENDPOINT,
                settings.AZURE_COSMOS_KEY
            )

            db = client.get_database_client(settings.AZURE_COSMOS_DB)
            container = db.get_container_client(settings.AZURE_COSMOS_CONTAINER)

            item = {
                "id": user_id,           
                "userId": user_id,       
                "companyType": company_type,
                "goal": goal
            }

            container.upsert_item(item)
            self.stdout.write(self.style.SUCCESS(f"✅ Successfully inserted user with ID: {user_id}"))

        except exceptions.CosmosHttpResponseError as e:
            self.stderr.write(self.style.ERROR("❌ Failed to insert user profile:"))
            self.stderr.write(str(e))
