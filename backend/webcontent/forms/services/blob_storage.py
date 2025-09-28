import logging 
import datetime 
import os
import uuid

from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient, generate_blob_sas, BlobSasPermissions

from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)
default_credential = DefaultAzureCredential()
account_key = os.getenv("STORAGE_ACCOUNT_KEY")

def upload_file_to_storage(user_id: str, file_obj) -> str:
    """
    Upload file to Azure Blob Storage with UUID filename
    Returns SAS URL for the uploaded blob
    """
    storage_account_name = os.environ.get("STORAGE_ACCOUNT_NAME")
    storage_account_key = os.environ.get("STORAGE_ACCOUNT_KEY")
    container_name = "images"

    if not storage_account_name or not storage_account_key:
        raise ValueError("Storage account credentials are not set in environment variables.")

    blob_service_client = BlobServiceClient(
        f"https://{storage_account_name}.blob.core.windows.net",
        credential=default_credential
    )
    container_client = blob_service_client.get_container_client(container_name)
    
    try:
        container_client.create_container()
    except Exception:
        pass  # Container may already exist

    # Simple UUID filename
    blob_name = f"{user_id}/{uuid.uuid4()}"
    blob_client = container_client.get_blob_client(blob_name)

    # Upload file
    blob_client.upload_blob(file_obj, overwrite=True)

    # Generate SAS token
    start_time = datetime.datetime.now(datetime.timezone.utc)
    expiry_time = start_time + datetime.timedelta(days=7)

    sas_token = generate_blob_sas(
        account_name=blob_client.account_name,
        container_name=blob_client.container_name,
        blob_name=blob_client.blob_name,
        permission=BlobSasPermissions(read=True),
        expiry=expiry_time,
        start=start_time,
        account_key=account_key
    )
    
    return f"{blob_client.url}?{sas_token}"

def upload_multiple_files(user_id: str, files_list) -> list:
    """
    Upload multiple files and return list of URLs
    files_list: list of file objects
    Returns: list of SAS URLs
    """
    urls = []
    for file_obj in files_list:
        try:
            url = upload_file_to_storage(user_id, file_obj)
            urls.append(url)
        except Exception as e:
            logger.error(f"Failed to upload file: {e}")
            urls.append(None)
    
    return urls