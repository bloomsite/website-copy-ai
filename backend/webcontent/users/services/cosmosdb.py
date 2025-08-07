from azure.cosmos import CosmosClient
from django.conf import settings
from dotenv import load_dotenv

load_dotenv()

client = CosmosClient(settings.AZURE_COSMOS_ENDPOINT, settings.AZURE_COSMOS_KEY)
database = client.get_database_client(settings.AZURE_COSMOS_DB)
container = database.get_container_client(settings.AZURE_COSMOS_CONTAINER)

def save_user_profile(user_id: str, company_type: str, goal: str):
    data = {
        "user_id": user_id,
        "companyType": company_type,
        "goal": goal
    }
    container.upsert_item(data)