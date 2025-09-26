# Lovable API Documentation

## Overview

The Lovable API provides endpoints for AI-powered component generation, project management, and deployment automation.

Base URL: `http://localhost:3001/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "User Name"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name"
    },
    "token": "jwt_token"
  }
}
```

#### POST /auth/login
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### GET /auth/me
Get current user profile (requires authentication).

### AI Generation

#### POST /ai/generate-component
Generate a React component from natural language description.

**Request Body:**
```json
{
  "prompt": "Create a responsive contact form with name, email, and message fields",
  "context": {
    "projectType": "landing-page",
    "stylePreference": "modern"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "component": "ContactForm",
    "code": "import React from 'react'...",
    "dependencies": ["react", "tailwindcss"],
    "metadata": {
      "generatedAt": "2024-01-01T00:00:00Z",
      "tokensUsed": 1500
    }
  }
}
```

#### POST /ai/refine-component
Refine existing component based on feedback.

**Request Body:**
```json
{
  "code": "existing component code",
  "feedback": "Make the form validation more user-friendly",
  "context": {}
}
```

#### POST /ai/analyze-code
Analyze component code quality and get suggestions.

**Request Body:**
```json
{
  "code": "component code to analyze"
}
```

### Projects

#### GET /projects
Get all projects for authenticated user.

**Query Parameters:**
- `limit` (optional): Number of projects to return
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "My Website",
      "description": "Personal portfolio site",
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /projects
Create a new project.

**Request Body:**
```json
{
  "name": "Project Name",
  "description": "Project description",
  "template": "blank"
}
```

#### GET /projects/:id
Get specific project by ID.

#### PUT /projects/:id
Update project details.

#### DELETE /projects/:id
Delete a project.

### Deployment

#### POST /deploy/:projectId
Deploy a project to production.

**Request Body:**
```json
{
  "domain": "my-app.com",
  "environment": "production"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "deployment_id",
    "url": "https://my-app.lovable-apps.com",
    "status": "pending"
  }
}
```

#### GET /deploy/:projectId/status
Get deployment status for a project.

#### DELETE /deploy/:deploymentId
Delete/rollback a deployment.

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message"
}
```

## Rate Limits

- 100 requests per 15 minutes per IP address
- Rate limit headers included in all responses:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

## WebSocket Events

Connect to `/` namespace for real-time updates:

### Events to emit:
- `join-project` - Join project room for updates
- `code-change` - Broadcast code changes

### Events to listen for:
- `code-updated` - Receive code updates
- `project-updated` - Project status changes

## SDK Examples

### JavaScript/Node.js

```javascript
const API_BASE = 'http://localhost:3001/api';

// Generate component
const response = await fetch(`${API_BASE}/ai/generate-component`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    prompt: 'Create a login form',
    context: {}
  })
});

const result = await response.json();
```

### Python

```python
import requests

API_BASE = 'http://localhost:3001/api'

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {token}'
}

response = requests.post(
    f'{API_BASE}/ai/generate-component',
    headers=headers,
    json={
        'prompt': 'Create a login form',
        'context': {}
    }
)

result = response.json()
```

## Webhooks

Configure webhooks to receive notifications about deployments and other events.

### Webhook Events

- `deployment.created`
- `deployment.completed`
- `deployment.failed`
- `project.updated`

### Webhook Payload

```json
{
  "event": "deployment.completed",
  "data": {
    "deploymentId": "dep_123",
    "projectId": "proj_456",
    "url": "https://app.example.com",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```