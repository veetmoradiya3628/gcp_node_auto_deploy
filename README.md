# Node.js Cloud Run Deployment with GitHub Actions

This repository demonstrates how to automatically deploy a Node.js application to **Google Cloud Run** using **GitHub Actions**.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Setup Google Cloud Services](#setup-google-cloud-services)
3. [Service Account Setup](#service-account-setup)
4. [GitHub Secrets Configuration](#github-secrets-configuration)
5. [GitHub Actions Workflow Setup](#github-actions-workflow-setup)
6. [Testing and Verification](#testing-and-verification)
7. [Permissions](#permissions)

## Prerequisites

- **Google Cloud Project**: You must have a Google Cloud project set up.
- **Docker**: Installed locally for building images and pushing to the registry (optional for testing).
- **GitHub**: A GitHub repository to store your code and workflows.

## Setup Google Cloud Services

1. **Enable APIs**:
   - Enable **Cloud Run API**.
   - Enable **Google Container Registry API** (or **Artifact Registry API** if using Artifact Registry).

2. **Create a Google Cloud Project**:  
   If you don't have one, create a project at [Google Cloud Console](https://console.cloud.google.com/).

3. **Create a Docker Image Repository**:
   - For **Google Container Registry (GCR)**: The repository is created automatically when you push images to `gcr.io`.
   - For **Artifact Registry**: You must manually create a repository.

## Service Account Setup

1. **Create a Service Account**:
   - Go to **IAM & Admin** > **Service Accounts** > **Create Service Account**.
   - Assign the following roles:
     - **Cloud Run Admin** (`roles/run.admin`): Full permissions to manage Cloud Run services.
     - **Service Account User** (`roles/iam.serviceAccountUser`): Allows acting as other service accounts (necessary for Cloud Run).
     - **Storage Admin** (`roles/storage.admin`): For managing Cloud Storage (if using Artifact Registry).

2. **Create and Download Service Account Key**:
   - After creating the service account, generate and download the **JSON key**. This key will be used in GitHub Actions for authentication.

## GitHub Secrets Configuration

In your **GitHub repository**:
1. Navigate to **Settings** > **Secrets and variables** > **Actions**.
2. Add the following secrets:
   - **`GCP_PROJECT_ID`**: Your Google Cloud Project ID.
   - **`GCP_SERVICE_ACCOUNT_KEY`**: The JSON key you downloaded when creating the service account.

## GitHub Actions Workflow Setup

1. Create a file in your repository at `.github/workflows/deploy.yml` with the following content:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      # Checkout code
      - name: Checkout code
        uses: actions/checkout@v3

      # Authenticate with Google Cloud
      - name: Authenticate with Google Cloud
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SERVICE_ACCOUNT_KEY }}

      # Set up Google Cloud SDK
      - name: Set up Google Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
        with:
          project_id: ${{ secrets.GCP_PROJECT_ID }}

      # Authenticate Docker with GCR
      - name: Authenticate Docker with GCR
        run: |
          gcloud auth configure-docker

      # Build and Push Docker Image to GCR
      - name: Build and Push Docker Image to GCR
        run: |
          IMAGE_NAME="gcr.io/${{ secrets.GCP_PROJECT_ID }}/hello-node-backend"
          docker build -t $IMAGE_NAME .
          docker push $IMAGE_NAME

      # Deploy to Cloud Run
      - name: Deploy to Cloud Run
        run: |
          IMAGE_NAME="gcr.io/${{ secrets.GCP_PROJECT_ID }}/hello-node-backend"
          gcloud run deploy hello-node-backend \
            --image $IMAGE_NAME \
            --platform managed \
            --region us-central1 \
            --allow-unauthenticated \
            --memory 512Mi
