# Deployment Guide

This guide covers different deployment options for the Lovable platform.

## Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase recommended)
- API keys for required services

## Environment Setup

1. Copy environment template:
   ```bash
   cp .env.example .env
   ```

2. Fill in required variables:
   ```bash
   # Database
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   
   # AI Services
   OPENAI_API_KEY=your_openai_key
   REPLICATE_API_TOKEN=your_replicate_token
   
   # Payment Processing
   STRIPE_SECRET_KEY=your_stripe_secret
   
   # Version Control
   GITHUB_ACCESS_TOKEN=your_github_token
   
   # Security
   JWT_SECRET=your_jwt_secret
   ```

## Local Development

1. Install dependencies:
   ```bash
   npm run install:all
   ```

2. Start all services:
   ```bash
   npm run dev
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - AI Engine: http://localhost:3002

## Production Deployment

### Option 1: Docker Deployment

1. Build Docker image:
   ```bash
   docker build -t lovable .
   ```

2. Run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

### Option 2: Cloud Platform Deployment

#### Vercel (Frontend)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy frontend:
   ```bash
   cd frontend
   vercel --prod
   ```

#### Railway (Backend)

1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

#### Supabase (Database)

1. Create new Supabase project
2. Run the SQL schema from `/database/schemas/supabase.sql`
3. Configure Row Level Security policies

### Option 3: VPS Deployment

#### Using PM2

1. Install PM2:
   ```bash
   npm install -g pm2
   ```

2. Create ecosystem file:
   ```javascript
   // ecosystem.config.js
   module.exports = {
     apps: [
       {
         name: 'lovable-backend',
         script: 'backend/src/index.js',
         env: {
           NODE_ENV: 'production',
           PORT: 3001
         }
       },
       {
         name: 'lovable-ai-engine',
         script: 'ai-engine/src/index.js',
         env: {
           NODE_ENV: 'production',
           PORT: 3002
         }
       }
     ]
   };
   ```

3. Start services:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Frontend
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # WebSocket support
    location /socket.io {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

## Database Migration

### Initial Setup

1. Create Supabase project
2. Run schema creation:
   ```sql
   -- Copy and run contents of /database/schemas/supabase.sql
   ```

### Migration Process

For schema updates:

1. Create migration file:
   ```sql
   -- migrations/001_add_new_table.sql
   CREATE TABLE new_table (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     -- columns...
   );
   ```

2. Apply migration in Supabase SQL editor

## SSL Certificate

### Using Let's Encrypt

1. Install Certbot:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. Generate certificate:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

3. Auto-renewal:
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

## Monitoring

### Health Checks

The backend includes health check endpoints:

- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system status

### Logging

Configure logging levels:

```bash
# Development
LOG_LEVEL=debug

# Production
LOG_LEVEL=error
```

### Error Tracking

Integrate error tracking service:

```javascript
// Add to backend/src/index.js
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});
```

## Performance Optimization

### Frontend

1. Build optimization:
   ```bash
   cd frontend
   npm run build
   ```

2. Enable gzip compression in Nginx:
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
   ```

### Backend

1. Enable Redis caching:
   ```javascript
   // Add Redis configuration
   const redis = require('redis');
   const client = redis.createClient(process.env.REDIS_URL);
   ```

2. Database connection pooling:
   ```javascript
   // Supabase handles this automatically
   ```

## Security Checklist

- [ ] Environment variables secured
- [ ] JWT secrets are strong and unique
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] Input validation in place
- [ ] SQL injection protection (Supabase handles this)
- [ ] XSS protection headers
- [ ] CORS properly configured

## Backup Strategy

### Database Backup

Supabase provides automatic backups, but for additional safety:

1. Set up daily exports
2. Store in external storage (AWS S3, etc.)

### Code Backup

1. Use Git for version control
2. Multiple remote repositories
3. Regular releases/tags

## Scaling Considerations

### Horizontal Scaling

1. Load balancer configuration
2. Multiple backend instances
3. Session store (Redis)
4. CDN for static assets

### Database Scaling

1. Read replicas (Supabase Pro)
2. Connection pooling
3. Query optimization

## Troubleshooting

### Common Issues

1. **Port conflicts**:
   ```bash
   # Check running processes
   lsof -i :3001
   ```

2. **Environment variables not loading**:
   ```bash
   # Verify .env file location and syntax
   cat .env | head -5
   ```

3. **Database connection issues**:
   ```bash
   # Test Supabase connection
   curl -H "apikey: $SUPABASE_ANON_KEY" $SUPABASE_URL/rest/v1/
   ```

### Log Analysis

1. Backend logs:
   ```bash
   pm2 logs lovable-backend
   ```

2. Nginx logs:
   ```bash
   tail -f /var/log/nginx/error.log
   ```

## Support

- Check the troubleshooting section
- Review server logs
- Contact support with error details and environment info