# Lovable Backend

Node.js backend API for the Lovable AI-powered no-code web app builder.

## Features

- **Express.js API**: RESTful API endpoints
- **Supabase Integration**: Database and authentication
- **OpenAI Integration**: AI component generation
- **Socket.IO**: Real-time collaboration
- **JWT Authentication**: Secure user sessions
- **Rate Limiting**: API protection
- **Input Validation**: Request validation with Joi

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase project
- OpenAI API key

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp ../.env.example .env
   # Fill in your API keys and configuration
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. API will be available at http://localhost:3001

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### AI Generation
- `POST /api/ai/generate-component` - Generate React component
- `POST /api/ai/refine-component` - Refine existing component
- `POST /api/ai/analyze-code` - Analyze component code

### Projects
- `GET /api/projects` - Get user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Deployment
- `POST /api/deploy/:projectId` - Deploy project
- `GET /api/deploy/:projectId/status` - Get deployment status
- `DELETE /api/deploy/:deploymentId` - Delete deployment

## Project Structure

```
src/
├── routes/         # API route handlers
├── middleware/     # Express middleware
├── models/         # Data models
├── utils/          # Utility functions
├── config/         # Configuration files
└── index.js        # Application entry point
```

## Environment Variables

Required environment variables:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `OPENAI_API_KEY` - OpenAI API key
- `JWT_SECRET` - JWT signing secret
- `FRONTEND_URL` - Frontend application URL

## Database Schema

The backend uses Supabase PostgreSQL with the following main tables:

- `users` - User accounts
- `projects` - User projects
- `components` - Project components
- `ai_generations` - AI generation history
- `deployments` - Deployment records

See `/database/schemas/supabase.sql` for the complete schema.

## Authentication

The API uses JWT tokens for authentication:

1. User registers/logs in
2. Server returns JWT token
3. Client includes token in Authorization header
4. Server validates token for protected routes

## Rate Limiting

API includes rate limiting:
- 100 requests per 15-minute window per IP
- Headers include rate limit information

## Error Handling

Consistent error response format:
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Contributing

1. Follow the existing code style
2. Add tests for new endpoints
3. Update API documentation
4. Use proper error handling