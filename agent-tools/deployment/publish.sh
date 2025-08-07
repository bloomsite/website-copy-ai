#!/bin/bash
# === CONFIGURATION ===

FUNCTION_APP_NAME="webcopy-ai-agent-tools"

# === DEPLOY FUNCTION ===
echo "📤 Publishing function to Azure..."
func azure functionapp publish "$FUNCTION_APP_NAME"

echo "✅ Deployment complete!"
