# Telegram Bot on JS using GrammyJS library

This project is a Telegram Bot built with JavaScript using the GrammyJS library.

## Setup

To build and deploy the CI/CD pipeline, you need to set up the following GitHub Actions Secrets:

- `AZURE_CREDENTIALS`: Your Azure credentials to deploy the container.
- `BOT_API_KEY`: Your Telegram Bot API Key.
- `GHCR_PAT`: Your GitHub Container Registry Token.
-  `STOCK_API_KEY`: API KEY Token for stocks API provider

## Usage

Before running the commands to start or stop the bot, make sure you are logged into your Azure account. You can do this by running `az login`.

To stop the Telegram Bot on the server, use the following command:

```bash
az container stop --name telegram-bot --resource-group MyGeneralResourceGroup

To run again without redeployment:

```bash
az container stop --name telegram-bot --resource-group MyGeneralResourceGroup