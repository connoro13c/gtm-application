# Environment Variables Documentation

This document outlines clearly all the required environment variables for the Advanced Account Scoring & Segmentation Application across different deployment environments (development, staging, production).

## 🌐 Frontend Variables

| Variable Name | Description | Example Values |
|---------------|-------------|----------------|
| REACT_APP_API_URL | URL of backend API endpoints | https://api.yourapp.com (production) |
| REACT_APP_AUTH_DOMAIN | Domain for authentication provider | yourapp.auth0.com |
| REACT_APP_CLIENT_ID | Client ID for Auth provider integration | abc123xyz |

## 🔐 Backend Environment Variables

| Variable Name | Purpose | Example Value |
|---------------|---------|---------------|
| DATABASE_URL | Connection string for database (Postgres) | postgresql://user:password@host:5432/dbname |
| NODE_ENV | Application runtime environment | development, staging, production |
| AUTH0_CLIENT_ID | Auth0 Client ID for authentication | Provided by Auth0 |
| AUTH0_CLIENT_SECRET | Auth0 Client Secret | Securely stored, never exposed in codebase |
| JWT_SECRET | Secret key for JWT token signing | Securely stored secret |
| ML_SERVICE_ENDPOINT | Endpoint URL for ML model scoring | https://ml-api.yourapp.com |

## 📌 Usage Instructions

- Store environment variables securely (use environment management tools or services like Doppler, AWS Secrets Manager, or Azure Key Vault).
- Load variables dynamically in application deployment scripts or via CI/CD pipelines.
- Ensure variables are never hard-coded or committed to version control.

## 🔐 Security Considerations

- Use encrypted secret management for sensitive credentials.
- Rotate credentials regularly.
- Audit and monitor access to environment variables and secrets.