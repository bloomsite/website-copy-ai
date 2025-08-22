from typing import Dict, Any
from azure.cosmos import CosmosClient
from django.conf import settings
from dotenv import load_dotenv


load_dotenv()


def _client() -> CosmosClient:
    """
    Create a Cosmos DB client using the configuration from settings.
    """
    return CosmosClient(
        url=settings.COSMOS['ENDPOINT'],
        credential=settings.COSMOS['KEY']
    )

def _container(database_name: str, container_name: str) -> Any:
    """
    Get a specific container from the Cosmos DB database.
    
    :param database_name: Name of the database.
    :param container_name: Name of the container.
    :return: The specified container.
    """
    client = _client()
    database = client.get_database_client(database_name)
    return database.get_container_client(container_name)

def upsert_item(item: Dict[str, Any]) -> None:
    """
    Upsert an item into the Cosmos DB.
    
    :param item: The item to upsert.
    """
    container = _container(
        database_name=settings.COSMOS['DATABASE_FORM_DATA'], 
        container_name=settings.COSMOS['CONTAINER_FORM_DEFINITIONS']
        )
    
    print(container)
    print(settings.COSMOS['DATABASE_FORM_DATA'])
    print(settings.COSMOS['CONTAINER_FORM_DEFINITIONS'])
    
    container.upsert_item(item)

def delete_item(doc_id: str, pk: str) -> None:
    """
    Delete an item from the Cosmos DB.
    
    :param doc_id: The document ID of the item to delete.
    :param pk: The partition key of the item to delete.
    """
    container = _container(settings.COSMOS['DATABASE'], settings.COSMOS['CONTAINER'])
    container.delete_item(doc_id, partition_key=pk)

def upsert_definition(definition: Dict[str, Any]) -> None:
    """
    Upsert a form definition into the Cosmos DB.
    
    :param definition: The form definition to upsert.
    """
    container = _container(settings.COSMOS['DATABASE_FORM_DATA'], settings.COSMOS['CONTAINER_FORM_DEFINITIONS'])
    container.upsert_item(definition)

def get_published_definitions() -> list[Dict[str, Any]]:
    """
    Fetch all published definitions from the Cosmos DB.
    
    :return: A list of dictionaries containing the published definitions.
    """
    container = _container(settings.COSMOS['DATABASE'], settings.COSMOS['CONTAINER'])
    query = "SELECT * FROM c WHERE c.published = true"
    
    items = container.query_items(
        query=query,
        enable_cross_partition_query=True
    )
    
    return list(items)  # Convert to list to return all items at once