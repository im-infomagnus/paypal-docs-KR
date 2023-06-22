#!/bin/sh

set -e

echo "Test"

# Load the variable values from devcontainer.json
CLIENT_ID=$(jq -r '.secrets.CLIENT_ID' < ./.devcontainer/advanced-integration/devcontainer.json)
APP_SECRET=$(jq -r '.secrets.APP_SECRET' < ./.devcontainer/advanced-integration/devcontainer.json)

echo "CLIENT_ID: ${CLIENT_ID}"
echo "APP_SECRET: ${APP_SECRET}"

# Welcome message
WELCOME_MESSAGE="
👋 Welcome to the \"Checkout Advanced Integration Example\"

🛠️  Your environment is fully setup with all the required software.

🚀 Once you rename the \".env.example\" file to \".env\" and update \"CLIENT_ID\" and \"APP_SECRET\", the checkout page will automatically open in the browser after the server is restarted."

ALTERNATE_WELCOME_MESSAGE="
👋 Welcome to the \"Checkout Advanced Integration Example\"

🛠️  Your environment is fully setup with all the required software.

🚀 The checkout page will automatically open in the browser after the server is started."

# Check if the variable is empty
if [ -z "$CLIENT_ID" ] && [ -z "$APP_SECRET" ]; then
    WELCOME_MESSAGE="${ALTERNATE_WELCOME_MESSAGE}"
else
    echo "The variables are not empty."
fi

# Path to the output file
output_file="first-run-notice.txt"

# Write the welcome message to the output file
echo "${WELCOME_MESSAGE}" > "${output_file}"


