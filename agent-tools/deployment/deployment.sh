#!/bin/bash

# === CONFIGURATION ===

# Existing values
RESOURCE_GROUP="rg-dylan.okyere-5729"
LOCATION="swedencentral"
STORAGE_ACCOUNT="webcopyai" 
FUNCTION_APP_NAME="webcopy-ai-agent-tools"

# Runtime
RUNTIME="python"
PYTHON_VERSION="3.10"
FUNCTIONS_VERSION="4"

# === CHECK AZ CLI ===
if ! command -v az &> /dev/null
then
    echo "❌ Azure CLI is not installed. Install it first: https://aka.ms/installazurecli"
    exit 1
fi

# === LOGIN (optional, skip if already logged in) ===
# az login

echo "🚀 Starting deployment of Azure Function..."

# === CREATE FUNCTION APP (if not exists) ===
echo "🔍 Checking if Function App already exists..."

if az functionapp show --name "$FUNCTION_APP_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null
then
    echo "✅ Function App '$FUNCTION_APP_NAME' already exists. Skipping creation."
else
    echo "📦 Creating Function App '$FUNCTION_APP_NAME'..."

    az functionapp create \
        --name "$FUNCTION_APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --storage-account "$STORAGE_ACCOUNT" \
        --consumption-plan-location "$LOCATION" \
        --runtime "$RUNTIME" \
        --runtime-version "$PYTHON_VERSION" \
        --functions-version "$FUNCTIONS_VERSION" \
        --os-type Linux
fi
