
import os
import json 
import logging
import azure.functions as func
from azure.cosmos import CosmosClient, exceptions

app = func.FunctionApp()

@app.function_name(name="get_user_profile")
@app.route(route="get_user_profile", auth_level=func.AuthLevel.FUNCTION)
def get_user_profile(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    user_id = req.params.get('user_id')
    if not user_id:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            user_id = req_body.get('user_id')

    try:

        # Read environment variables
        endpoint = os.environ["AZURE_COSMOS_ENDPOINT"]
        key = os.environ["AZURE_COSMOS_KEY"]
        db_name = os.environ["AZURE_COSMOS_DB"]
        container_name = os.environ["AZURE_COSMOS_CONTAINER"]

        # Connect to Cosmos DB
        client = CosmosClient(endpoint, key)
        db = client.get_database_client(db_name)
        container = db.get_container_client(container_name)

        # Read the user profile
        user_data = container.read_item(item=user_id, partition_key=user_id)

        return func.HttpResponse(
            json.dumps(user_data),
            status_code=200,
            mimetype="application/json"
        )
    
    except exceptions.CosmosResourceNotFoundError:
        return func.HttpResponse(
            json.dumps({"error": f"User with ID {user_id} not found."}),
            status_code=404,
            mimetype="application/json"
        )
    
    except Exception as e:
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            mimetype="application/json"
        )
