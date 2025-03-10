# API Documentation

This document provides comprehensive documentation for the Advanced Account Scoring & Segmentation Application API endpoints, request/response formats, and authentication.

## Base URL

- Development: `http://localhost:8000/api`
- Staging: `https://staging-api.yourapp.com/api`
- Production: `https://api.yourapp.com/api`

## Authentication

All API requests require authentication using JWT tokens.

### Authentication Headers

```
Authorization: Bearer <token>
```

## API Versioning

The API uses versioning in the URL path. Current version is `v1`.

Example: `https://api.yourapp.com/api/v1/accounts`

## Core Endpoints

### Accounts

#### GET /accounts
Retrieves list of accounts.

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page
- `sort` (optional): Field to sort by
- `order` (optional): Sort order (asc, desc)
- `filter` (optional): Filter criteria

**Response:**
```json
{
  "data": [
    {
      "id": "acc123",
      "name": "Acme Corporation",
      "score": 85,
      "segment": "Enterprise",
      "lastUpdated": "2023-12-01T12:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 25,
    "total": 1500
  }
}
```

#### POST /accounts/score
Initiates scoring via selected ML model.

**Request Body:**
```json
{
  "modelId": "model123",
  "parameters": {
    "firmographicsWeight": 0.4,
    "engagementWeight": 0.3,
    "salesHistoryWeight": 0.2,
    "userInputWeight": 0.1
  }
}
```

**Response:**
```json
{
  "jobId": "job123",
  "status": "processing",
  "estimatedCompletion": "2023-12-01T12:30:00Z"
}
```

#### GET /accounts/:id
Fetch details for a specific account.

**Response:**
```json
{
  "id": "acc123",
  "name": "Acme Corporation",
  "score": 85,
  "segment": "Enterprise",
  "details": {
    "firmographics": { ... },
    "engagement": { ... },
    "salesHistory": { ... }
  }
}
```

### Territories

#### GET /territories
Retrieves all territory data.

#### POST /territories/calculate
Recalculates territory assignments.

### Segments

#### GET /segments
Retrieves current segmentation.

## Error Handling

All errors follow a standard format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  }
}
```

Common error codes:
- `UNAUTHORIZED`: Authentication required or failed
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid request parameters
- `SERVER_ERROR`: Internal server error

## Rate Limiting

API requests are rate-limited to 100 requests per minute per API key.

Headers included in responses:
- `X-RateLimit-Limit`: Request limit per minute
- `X-RateLimit-Remaining`: Remaining requests in the current period
- `X-RateLimit-Reset`: Time when the rate limit resets