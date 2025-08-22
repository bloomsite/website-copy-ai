from azure.cosmos import CosmosClient
from django.conf import settings
from dotenv import load_dotenv

load_dotenv()

client = CosmosClient(settings.COSMOS['ENDPOINT'], settings.COSMOS['KEY'])
database = client.get_database_client(settings.COSMOS['DATABASE_USER_DATA'])
container = database.get_container_client(settings.COSMOS['CONTAINER_USER_PROFILES'])

def save_user_profile(user_id: str, company_type: str, goal: str):
    data = {
        "user_id": user_id,
        "companyType": company_type,
        "goal": goal
    }
    container.upsert_item(data)

def update_user_profile(user_data: dict):
    container.upsert_item(user_data)