# Infrastructure Configuration

This directory contains infrastructure-related configuration files for deployment and operations.

## 📁 Directory Structure

```
infrastructure/
└── nginx/
    └── nginx.conf    # Nginx configuration for web server
```

## 📂 Contents

### Nginx Configuration
- **nginx.conf**: Nginx server configuration for serving the QuietSpace frontend application.

## 🔧 Usage

### Development

```bash
# Test nginx configuration
nginx -t -c infrastructure/nginx/nginx.conf

# Start nginx with custom config
nginx -c infrastructure/nginx/nginx.conf
```

### Docker Integration

The nginx configuration can be used with Docker containers:

```dockerfile
COPY infrastructure/nginx/nginx.conf /etc/nginx/nginx.conf
```

### Production Deployment

For production deployments, ensure the nginx configuration is properly configured for:
- SSL/TLS termination
- Static file serving
- Reverse proxy setup
- Load balancing (if needed)

## 📝 Configuration Details

The current nginx.conf includes:
- Basic web server setup
- Static file serving
- gzip compression
- Security headers
- Error handling

## 🚀 Maintenance

- Update nginx configuration as needed for different deployment environments
- Add environment-specific configs (development, staging, production)
- Include SSL certificates and security configurations
- Document any custom modifications
