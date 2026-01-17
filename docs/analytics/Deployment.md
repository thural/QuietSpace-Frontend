# Analytics Deployment Guide

## Overview

This guide covers the deployment of the QuietSpace Analytics system across different environments, including configuration, monitoring, and maintenance procedures.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Configuration](#configuration)
4. [Deployment Process](#deployment-process)
5. [Environment-Specific Deployments](#environment-specific-deployments)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)
7. [Troubleshooting](#troubleshooting)
8. [Security Considerations](#security-considerations)

## Prerequisites

### System Requirements

**Minimum Requirements:**
- **Node.js:** 18.x or higher
- **Memory:** 4GB RAM minimum, 8GB recommended
- **Storage:** 20GB available space
- **Network:** Stable internet connection

**Recommended Requirements:**
- **Node.js:** 20.x LTS
- **Memory:** 16GB RAM
- **Storage:** 50GB SSD
- **CPU:** 4+ cores

### Database Requirements

**PostgreSQL:**
- **Version:** 13.x or higher
- **Memory:** 2GB minimum
- **Storage:** 100GB+ for analytics data
- **Connection Pool:** 20+ connections

**Redis (for caching):**
- **Version:** 6.x or higher
- **Memory:** 1GB minimum
- **Persistence:** Enabled

### External Services

**Required:**
- **Message Queue:** RabbitMQ or Apache Kafka
- **Search Engine:** Elasticsearch 7.x+
- **Object Storage:** AWS S3 or equivalent
- **CDN:** CloudFlare or AWS CloudFront

## Environment Setup

### Development Environment

```bash
# Clone repository
git clone https://github.com/quietspace/analytics.git
cd analytics

# Install dependencies
npm install

# Setup environment
cp .env.example .env.development

# Start development server
npm run dev
```

### Staging Environment

```bash
# Clone repository
git clone https://github.com/quietspace/analytics.git
cd analytics

# Install dependencies
npm ci --production

# Setup environment
cp .env.example .env.staging

# Build application
npm run build

# Start staging server
npm run start:staging
```

### Production Environment

```bash
# Clone repository
git clone https://github.com/quietspace/analytics.git
cd analytics

# Install dependencies
npm ci --production

# Setup environment
cp .env.example .env.production

# Build application
npm run build

# Start production server
npm run start:production
```

## Configuration

### Environment Variables

Create `.env` file with the following configuration:

```bash
# Application Configuration
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/analytics
DATABASE_POOL_SIZE=20
DATABASE_TIMEOUT=30000

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password
REDIS_DB=0

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your-refresh-token-secret

# Analytics Configuration
ANALYTICS_API_KEY=your-analytics-api-key
ANALYTICS_ENDPOINT=https://api.analytics.quietspace.com
ANALYTICS_TIMEOUT=10000

# Feature Flags
USE_NEW_ARCHITECTURE=true
USE_DI_ANALYTICS=true
USE_DI_NOTIFICATIONS=true
USE_DI_CONTENT=true

# Performance Configuration
CACHE_TTL=3600
CACHE_MAX_SIZE=1000
RATE_LIMIT_WINDOW=3600000
RATE_LIMIT_MAX=1000

# Monitoring and Logging
LOG_LEVEL=info
LOG_FORMAT=json
METRICS_ENABLED=true
HEALTH_CHECK_ENABLED=true

# Security Configuration
CORS_ORIGIN=https://your-domain.com
CORS_CREDENTIALS=true
HELMET_ENABLED=true
RATE_LIMITING_ENABLED=true

# External Services
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_INDEX=analytics-events
MESSAGE_QUEUE_URL=amqp://localhost:5672
OBJECT_STORAGE_BUCKET=analytics-data
CDN_URL=https://cdn.your-domain.com

# WebSocket Configuration
WEBSOCKET_ENABLED=true
WEBSOCKET_PORT=3001
WEBSOCKET_PATH=/ws

# Background Jobs
JOB_QUEUE_ENABLED=true
JOB_CONCURRENCY=10
JOB_RETRY_ATTEMPTS=3
```

### Database Configuration

**PostgreSQL Setup:**

```sql
-- Create database
CREATE DATABASE analytics;

-- Create user
CREATE USER analytics_user WITH PASSWORD 'secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE analytics TO analytics_user;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create indexes for performance
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_session ON analytics_events(session_id);
```

**Redis Configuration:**

```bash
# redis.conf
maxmemory 1gb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
appendonly yes
appendfsync everysec
```

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/analytics
server {
    listen 80;
    server_name analytics.your-domain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name analytics.your-domain.com;
    
    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    
    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
    
    # Main Application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        limit_req zone=api burst=20 nodelay;
    }
    
    # API Endpoints
    location /api/ {
        proxy_pass http://localhost:3000;
        limit_req zone=api burst=50 nodelay;
    }
    
    # WebSocket
    location /ws {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Static Files
    location /static/ {
        alias /var/www/analytics/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Health Check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

## Deployment Process

### Automated Deployment with CI/CD

**GitHub Actions Workflow:**

```yaml
# .github/workflows/deploy.yml
name: Deploy Analytics

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci --production
      
      - name: Build application
        run: npm run build
      
      - name: Build Docker image
        run: |
          docker build -t quietspace/analytics:${{ github.sha }} .
          docker tag quietspace/analytics:${{ github.sha }} quietspace/analytics:latest
      
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push quietspace/analytics:${{ github.sha }}
          docker push quietspace/analytics:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/analytics
            docker-compose pull
            docker-compose up -d
            docker system prune -f
```

### Docker Configuration

**Dockerfile:**

```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# Build application
RUN npm run build

# Production image
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S analytics -u 1001

WORKDIR /app

# Copy built application
COPY --from=builder --chown=analytics:nodejs /app/dist ./dist
COPY --from=builder --chown=analytics:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=analytics:nodejs /app/package.json ./package.json

# Switch to non-root user
USER analytics

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Expose port
EXPOSE 3000

# Start application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
```

**Docker Compose:**

```yaml
# docker-compose.yml
version: '3.8'

services:
  analytics:
    image: quietspace/analytics:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://analytics:${DB_PASSWORD}@postgres:5432/analytics
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    volumes:
      - ./logs:/app/logs
    networks:
      - analytics-network

  postgres:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_DB=analytics
      - POSTGRES_USER=analytics
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - analytics-network

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - analytics-network

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - analytics
    networks:
      - analytics-network

volumes:
  postgres_data:
  redis_data:

networks:
  analytics-network:
    driver: bridge
```

## Environment-Specific Deployments

### Development

**Docker Compose Dev:**

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  analytics:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
      - "9229:9229"  # Debug port
    environment:
      - NODE_ENV=development
      - LOG_LEVEL=debug
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=analytics_dev
      - POSTGRES_USER=dev
      - POSTGRES_PASSWORD=dev_password
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

### Staging

**Kubernetes Configuration:**

```yaml
# k8s/staging/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: analytics-staging
  namespace: staging
spec:
  replicas: 2
  selector:
    matchLabels:
      app: analytics-staging
  template:
    metadata:
      labels:
        app: analytics-staging
    spec:
      containers:
      - name: analytics
        image: quietspace/analytics:${BUILD_NUMBER}
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "staging"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: analytics-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: analytics-secrets
              key: redis-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Production

**Kubernetes Production:**

```yaml
# k8s/production/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: analytics-production
  namespace: production
spec:
  replicas: 5
  selector:
    matchLabels:
      app: analytics-production
  template:
    metadata:
      labels:
        app: analytics-production
    spec:
      containers:
      - name: analytics
        image: quietspace/analytics:${BUILD_NUMBER}
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: analytics-secrets
              key: database-url
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

## Monitoring and Maintenance

### Health Checks

**Health Check Endpoint:**

```typescript
// src/health.ts
import express from 'express';
import { DatabaseService } from './services/database';
import { RedisService } from './services/redis';

export function setupHealthChecks(app: express.Application) {
  app.get('/health', async (req, res) => {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {}
    };

    try {
      // Check database
      await DatabaseService.ping();
      health.services.database = 'healthy';
    } catch (error) {
      health.services.database = 'unhealthy';
      health.status = 'unhealthy';
    }

    try {
      // Check Redis
      await RedisService.ping();
      health.services.redis = 'healthy';
    } catch (error) {
      health.services.redis = 'unhealthy';
      health.status = 'unhealthy';
    }

    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
  });
}
```

### Metrics Collection

**Prometheus Metrics:**

```typescript
// src/metrics.ts
import { register, Counter, Histogram, Gauge } from 'prom-client';

// Create metrics
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const activeConnections = new Gauge({
  name: 'websocket_connections_active',
  help: 'Number of active WebSocket connections'
});

// Register metrics
register.registerMetric(httpRequestsTotal);
register.registerMetric(httpRequestDuration);
register.registerMetric(activeConnections);

export { httpRequestsTotal, httpRequestDuration, activeConnections };
```

### Log Management

**Winston Logger Configuration:**

```typescript
// src/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'analytics' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

### Backup Procedures

**Database Backup Script:**

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/analytics"
DB_NAME="analytics"
DB_USER="analytics"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
pg_dump -U $DB_USER -h localhost $DB_NAME | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Create Redis backup
redis-cli --rdb $BACKUP_DIR/redis_backup_$DATE.rdb

# Upload to S3
aws s3 cp $BACKUP_DIR/db_backup_$DATE.sql.gz s3://analytics-backups/database/
aws s3 cp $BACKUP_DIR/redis_backup_$DATE.rdb s3://analytics-backups/redis/

# Clean old backups (keep last 30 days)
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.rdb" -mtime +30 -delete

echo "Backup completed: $DATE"
```

## Troubleshooting

### Common Issues

**1. Database Connection Errors**

```bash
# Check database connectivity
psql -h localhost -U analytics -d analytics -c "SELECT 1;"

# Check connection pool
SELECT * FROM pg_stat_activity WHERE datname = 'analytics';

# Reset connections
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'analytics';
```

**2. Redis Connection Issues**

```bash
# Check Redis status
redis-cli ping

# Check memory usage
redis-cli info memory

# Clear cache if needed
redis-cli FLUSHALL
```

**3. Performance Issues**

```bash
# Check system resources
top
htop
iotop

# Check Node.js process
ps aux | grep node
kill -USR2 <pid>  # Get heap dump
```

### Debug Mode

Enable debug mode for detailed logging:

```bash
# Set debug environment
export DEBUG=analytics:*
export LOG_LEVEL=debug

# Run with debug flags
node --inspect dist/index.js
```

### Log Analysis

**Analyze Error Logs:**

```bash
# Find recent errors
tail -f logs/error.log | grep ERROR

# Analyze patterns
grep "ERROR" logs/combined.log | awk '{print $1}' | sort | uniq -c | sort -nr

# Check response times
grep "request_duration" logs/combined.log | jq '.duration' | sort -n
```

## Security Considerations

### Environment Security

1. **Use environment variables** for sensitive data
2. **Enable HTTPS** with valid SSL certificates
3. **Implement rate limiting** to prevent abuse
4. **Use security headers** (HSTS, CSP, etc.)
5. **Regular security updates** for dependencies

### Database Security

1. **Use connection pooling** with proper limits
2. **Implement row-level security** for multi-tenant data
3. **Regular backups** with encryption
4. **Audit logging** for data access
5. **Network isolation** for database servers

### Application Security

1. **Input validation** for all user inputs
2. **SQL injection prevention** with parameterized queries
3. **XSS protection** with proper output encoding
4. **CSRF protection** with tokens
5. **Dependency scanning** for vulnerabilities

### Monitoring Security

1. **Intrusion detection** for unusual patterns
2. **Security logging** for audit trails
3. **Access control** for monitoring tools
4. **Alert notifications** for security events
5. **Regular security audits** and penetration testing

## Support

For deployment support:
- **Documentation:** https://docs.quietspace.com/analytics/deployment
- **Support Email:** analytics-support@quietspace.com
- **Status Page:** https://status.quietspace.com
- **Emergency Contact:** emergency@quietspace.com
