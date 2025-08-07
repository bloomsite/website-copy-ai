from django.core.management.base import BaseCommand
from azure.cosmos import CosmosClient, exceptions
from django.conf import settings

class Command(BaseCommand):
    help = 'Tests connection to Azure Cosmos DB and queries one item'

    def handle(self, *args, **kwargs):
        try:
            client = CosmosClient(
                settings.AZURE_COSMOS_ENDPOINT,
                settings.AZURE_COSMOS_KEY
            )
            self.stdout.write(self.style.SUCCESS("✅ Connected to Cosmos DB."))

            db = client.get_database_client(settings.AZURE_COSMOS_DB)
            self.stdout.write(self.style.SUCCESS(f"✅ Found database: {settings.AZURE_COSMOS_DB}"))

            container = db.get_container_client(settings.AZURE_COSMOS_CONTAINER)
            self.stdout.write(self.style.SUCCESS(f"✅ Found container: {settings.AZURE_COSMOS_CONTAINER}"))

            items = list(container.query_items(
                query="SELECT TOP 1 * FROM c",
                enable_cross_partition_query=True
            ))

            if items:
                self.stdout.write(self.style.SUCCESS(f"✅ Sample item:\n{items[0]}"))
            else:
                self.stdout.write("ℹ️ No items found in the container.")

        except exceptions.CosmosHttpResponseError as e:
            self.stderr.write(self.style.ERROR("❌ Cosmos DB connection failed:"))
            self.stderr.write(str(e))
