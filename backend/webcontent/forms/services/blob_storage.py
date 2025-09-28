import logging
import datetime
import os
import uuid
import time
from typing import IO

from azure.identity import DefaultAzureCredential
from azure.storage.blob import (
    BlobServiceClient,
    generate_blob_sas,
    BlobSasPermissions,
)

from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


class UploadError(Exception):
    """Raised when an upload to blob storage fails after retries."""


def _get_env_var(name: str) -> str:
    val = os.environ.get(name)
    if not val:
        logger.debug("Environment variable %s is not set or empty.", name)
        raise ValueError(f"Required environment variable {name} is not set.")
    return val


def upload_file_to_storage(user_id: str, file_obj: IO, *, max_retries: int = 3) -> str:
    """
    Upload file to Azure Blob Storage with a UUID filename.

    - Validates required environment variables early.
    - Ensures file_obj is seeked to start before upload.
    - Retries transient failures with exponential backoff.
    - Returns a read-only SAS URL (7 days) for the uploaded blob.

    Args:
        user_id: Identifier used as a pseudo-directory prefix for the blob name.
        file_obj: A file-like object opened in binary mode.
        max_retries: Number of attempts for transient failures (default 3).

    Returns:
        A full URL to the blob including a SAS token granting read access.

    Raises:
        ValueError: If required env vars are missing.
        UploadError: If upload fails after retries.
    """
    storage_account_name = _get_env_var("STORAGE_ACCOUNT_NAME")
    storage_account_key = _get_env_var("STORAGE_ACCOUNT_KEY")
    container_name = os.environ.get("STORAGE_CONTAINER", "images")

    # Ensure the file-like object is at the beginning
    try:
        file_obj.seek(0)
    except Exception:
        logger.debug("file_obj does not support seek(); proceeding without seek.")

    blob_service_url = f"https://{storage_account_name}.blob.core.windows.net"

    # Use DefaultAzureCredential for service client auth if available; account key needed for SAS generation
    try:
        credential = DefaultAzureCredential()
    except Exception as e:
        logger.warning("DefaultAzureCredential initialization failed: %s", e)
        credential = None

    logger.info("Connecting to BlobServiceClient at %s", blob_service_url)
    try:
        blob_service_client = BlobServiceClient(blob_service_url, credential=credential)
    except Exception as e:
        logger.exception("Failed to create BlobServiceClient: %s", e)
        raise UploadError(f"Failed to initialize blob service client: {e}") from e

    container_client = blob_service_client.get_container_client(container_name)

    # Ensure container exists (idempotent)
    try:
        if not container_client.exists():
            logger.info("Container '%s' does not exist. Creating...", container_name)
            container_client.create_container()
    except Exception as e:
        logger.exception("Failed to ensure container '%s' exists: %s", container_name, e)
        raise UploadError(f"Failed to ensure container exists: {e}") from e

    # Build blob name and client
    blob_name = f"{user_id}/{uuid.uuid4()}"
    blob_client = container_client.get_blob_client(blob_name)

    # Upload with retry loop for transient errors
    attempt = 0
    while True:
        try:
            attempt += 1
            logger.info("Uploading blob '%s' (attempt %d)...", blob_name, attempt)
            # Reset file_obj position before each attempt if possible
            try:
                file_obj.seek(0)
            except Exception:
                logger.debug("file_obj.seek(0) failed before upload attempt; continuing.")

            # overwrite True to allow idempotent re-tries
            blob_client.upload_blob(file_obj, overwrite=True)
            logger.info("Upload successful for blob '%s'", blob_name)
            break
        except Exception as e:
            logger.exception("Upload attempt %d failed for blob '%s': %s", attempt, blob_name, e)
            # Decide whether to retry
            if attempt >= max_retries:
                raise UploadError(f"Upload failed after {attempt} attempts: {e}") from e
            # Simple exponential backoff with jitter
            backoff = (2 ** attempt) + (0.1 * (uuid.uuid4().int % 10))
            logger.info("Retrying upload in %.2f seconds...", backoff)
            time.sleep(backoff)

    # Generate SAS token for read access. We require the account key for SAS generation.
    try:
        start_time = datetime.datetime.now(datetime.timezone.utc)
        expiry_time = start_time + datetime.timedelta(days=7)

        sas_token = generate_blob_sas(
            account_name=blob_client.account_name,
            container_name=blob_client.container_name,
            blob_name=blob_client.blob_name,
            permission=BlobSasPermissions(read=True),
            expiry=expiry_time,
            start=start_time,
            account_key=storage_account_key,
        )
    except Exception as e:
        logger.exception("Failed to generate SAS token for blob '%s': %s", blob_name, e)
        raise UploadError(f"Failed to generate SAS token: {e}") from e

    sas_url = f"{blob_client.url}?{sas_token}"
    logger.debug("Generated SAS URL (masked) for blob '%s': %s...", blob_name, sas_url[:80])
    
    return sas_url