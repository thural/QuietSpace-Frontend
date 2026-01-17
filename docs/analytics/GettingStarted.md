# Getting Started Guide

## 🎯 Welcome to QuietSpace Analytics

This guide will help you get up and running with the QuietSpace Analytics system in minutes. Whether you're a developer looking to integrate analytics into your application or a business user wanting to understand your data, this guide has you covered.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Basic Usage](#basic-usage)
5. [Advanced Features](#advanced-features)
6. [Next Steps](#next-steps)
7. [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### System Requirements

**Minimum Requirements:**
- **Node.js:** 18.x or higher
- **Memory:** 4GB RAM
- **Storage:** 10GB available space
- **Operating System:** Windows 10+, macOS 10.15+, or Linux

**Recommended Requirements:**
- **Node.js:** 20.x LTS
- **Memory:** 8GB RAM
- **Storage:** 20GB SSD
- **CPU:** 4+ cores

### Required Software

1. **Node.js and npm**
   ```bash
   # Install Node.js from https://nodejs.org or use version manager
   node --version  # Should be 18.x or higher
   npm --version   # Should be 9.x or higher
   ```

2. **Git**
   ```bash
   git --version  # Should be 2.x or higher
   ```

3. **Database (Optional for development)**
   - **PostgreSQL:** 13.x or higher
   - **Redis:** 6.x or higher

## 📦 Installation

### Option 1: Clone from GitHub (Recommended)

```bash
# Clone the repository
git clone https://github.com/quietspace/analytics.git
cd analytics

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env
```

### Option 2: Install via npm

```bash
# Install the analytics package
npm install @quietspace/analytics

# Install peer dependencies
npm install react react-dom @quietspace/core
```

### Option 3: Use Docker

```bash
# Pull the Docker image
docker pull quietspace/analytics:latest

# Run the container
docker run -p 3000:3000 quietspace/analytics:latest
```

## ⚙️ Environment Setup

### Basic Configuration

Create a `.env` file in the root directory:

```bash
# Application Configuration
NODE_ENV=development
PORT=3000

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Feature Flags
USE_NEW_ARCHITECTURE=true
USE_DI_ANALYTICS=true

# Database (for development)
DATABASE_URL=postgresql://user:password@localhost:5432/analytics
REDIS_URL=redis://localhost:6379
```

### Production Configuration

For production, use these additional settings:

```bash
# Security
CORS_ORIGIN=https://your-domain.com
HELMET_ENABLED=true
RATE_LIMITING_ENABLED=true

# Performance
CACHE_TTL=3600
RATE_LIMIT_MAX=1000

# Monitoring
LOG_LEVEL=info
METRICS_ENABLED=true
```

## 🚀 Quick Start

### Step 1: Start the Development Server

```bash
# Start in development mode
npm run dev

# The application will be available at http://localhost:3000
```

### Step 2: Verify Installation

Open your browser and navigate to `http://localhost:3000`. You should see:

- ✅ Analytics Dashboard loading
- ✅ Sample metrics and charts
- ✅ Real-time data updates

### Step 3: Track Your First Event

```javascript
// In your browser console or application code
import { AnalyticsService } from '@quietspace/analytics-services';

const analytics = new AnalyticsService();

// Track a page view
await analytics.trackEvent({
  userId: 'demo-user',
  eventType: 'page_view',
  properties: {
    page: '/getting-started',
    title: 'Getting Started Guide'
  }
});

console.log('Event tracked successfully!');
```

## 📊 Basic Usage

### 1. Analytics Dashboard

The main dashboard provides real-time insights into your application:

```tsx
import { AnalyticsDashboard } from '@quietspace/analytics-components';

function App() {
  return (
    <AnalyticsDashboard 
      userId="user-123"
      timeframe="7d"
      autoRefresh={true}
      onMetricClick={(metric, value) => {
        console.log(`${metric}: ${value}`);
      }}
    />
  );
}
```

**Key Features:**
- **Real-time Metrics** - Live data updates
- **Timeframe Selection** - 1d, 7d, 30d, 90d views
- **Interactive Charts** - Click to drill down
- **Auto-refresh** - Configurable update intervals

### 2. Event Tracking

Track user interactions and system events:

```typescript
// Track page views
await analytics.trackEvent({
  userId: 'user-123',
  eventType: 'page_view',
  properties: {
    page: '/dashboard',
    referrer: '/login',
    userAgent: navigator.userAgent
  }
});

// Track user interactions
await analytics.trackEvent({
  userId: 'user-123',
  eventType: 'button_click',
  properties: {
    buttonId: 'save-button',
    action: 'save_settings',
    category: 'user_interaction'
  }
});

// Track feature usage
await analytics.trackEvent({
  userId: 'user-123',
  eventType: 'feature_usage',
  properties: {
    feature: 'report_builder',
    action: 'create_report',
    reportType: 'summary'
  }
});
```

### 3. Custom Charts

Create interactive visualizations:

```tsx
import { AdvancedCharts } from '@quietspace/analytics-components';

function MyChart() {
  const data = [
    { date: '2024-01-01', pageViews: 1000, users: 500 },
    { date: '2024-01-02', pageViews: 1200, users: 600 },
    { date: '2024-01-03', pageViews: 900, users: 450 }
  ];

  return (
    <AdvancedCharts
      data={data}
      type="line"
      title="Page Views Trend"
      height={400}
      interactive={true}
      onDataPointClick={(point) => {
        console.log('Selected data point:', point);
      }}
    />
  );
}
```

## 🔧 Advanced Features

### 1. Report Builder

Create custom reports with drag-and-drop interface:

```tsx
import { ReportBuilder } from '@quietspace/analytics-components';

function ReportsPage() {
  const handleSaveReport = async (report) => {
    // Save report to backend
    await analytics.saveReport(report);
    
    // Show success notification
    alert('Report saved successfully!');
  };

  const handlePreviewReport = async (report) => {
    // Generate preview
    const preview = await analytics.generateReportPreview(report);
    console.log('Report preview:', preview);
  };

  return (
    <ReportBuilder
      userId="user-123"
      onSave={handleSaveReport}
      onPreview={handlePreviewReport}
      templates={['summary', 'detailed', 'custom']}
    />
  );
}
```

### 2. Predictive Analytics

Get AI-powered insights and predictions:

```tsx
import { PredictiveAnalytics } from '@quietspace/analytics-components';

function PredictiveDashboard() {
  return (
    <PredictiveAnalytics
      userId="user-123"
      models={['traffic', 'engagement', 'conversion']}
      timeHorizon={30}
      onPredictionUpdate={(predictions) => {
        console.log('Updated predictions:', predictions);
      }}
    />
  );
}
```

### 3. Performance Monitoring

Monitor system performance in real-time:

```tsx
import { PerformanceMonitor } from '@quietspace/analytics-components';

function PerformancePage() {
  const handleAlert = (alert) => {
    // Send notification or take action
    console.warn('Performance alert:', alert);
  };

  return (
    <PerformanceMonitor
      userId="user-123"
      refreshInterval={5000}
      alertThresholds={{
        responseTime: 1000,
        errorRate: 0.05,
        memoryUsage: 0.8
      }}
      onAlert={handleAlert}
    />
  );
}
```

### 4. Cross-Feature Analytics

Integrate with other platform features:

```tsx
import { CrossFeatureAnalytics } from '@quietspace/analytics-components';

function IntegratedAnalytics() {
  return (
    <CrossFeatureAnalytics
      userId="user-123"
      features={['notifications', 'content', 'analytics']}
      timeRange={{
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date()
      }}
      onInsightClick={(insight) => {
        // Navigate to detailed view
        window.location.href = `/insights/${insight.id}`;
      }}
    />
  );
}
```

## 🎯 Common Use Cases

### 1. E-commerce Analytics

```typescript
// Track product views
await analytics.trackEvent({
  userId: 'user-123',
  eventType: 'product_view',
  properties: {
    productId: 'prod-456',
    category: 'electronics',
    price: 299.99,
    brand: 'ExampleBrand'
  }
});

// Track purchases
await analytics.trackEvent({
  userId: 'user-123',
  eventType: 'purchase',
  properties: {
    orderId: 'order-789',
    total: 599.98,
    items: [
      { productId: 'prod-456', quantity: 1, price: 299.99 },
      { productId: 'prod-457', quantity: 2, price: 150.00 }
    ]
  }
});
```

### 2. SaaS Analytics

```typescript
// Track feature usage
await analytics.trackEvent({
  userId: 'user-123',
  eventType: 'feature_usage',
  properties: {
    feature: 'export_data',
    plan: 'pro',
    usageCount: 5
  }
});

// Track subscription events
await analytics.trackEvent({
  userId: 'user-123',
  eventType: 'subscription_upgrade',
  properties: {
    fromPlan: 'basic',
    toPlan: 'pro',
    revenue: 49.00
  }
});
```

### 3. Content Analytics

```typescript
// Track content engagement
await analytics.trackEvent({
  userId: 'user-123',
  eventType: 'content_engagement',
  properties: {
    contentId: 'article-456',
    contentType: 'blog_post',
    category: 'technology',
    readTime: 180, // seconds
    scrollDepth: 0.8
  }
});
```

## 📱 Mobile Integration

### React Native

```javascript
import { AnalyticsService } from '@quietspace/analytics-mobile';

const analytics = new AnalyticsService({
  apiKey: 'your-api-key',
  platform: 'mobile'
});

// Track mobile events
await analytics.trackEvent({
  userId: 'user-123',
  eventType: 'app_open',
  properties: {
    platform: 'ios',
    version: '1.0.0',
    device: 'iPhone 12'
  }
});
```

### Flutter

```dart
import 'package:quietspace_analytics/quietspace_analytics.dart';

final analytics = QuietSpaceAnalytics(
  apiKey: 'your-api-key',
  platform: 'mobile'
);

// Track mobile events
await analytics.trackEvent(
  userId: 'user-123',
  eventType: 'app_open',
  properties: {
    'platform': 'android',
    'version': '1.0.0',
    'device': 'Pixel 6'
  }
);
```

## 🔍 Data Privacy and Compliance

### GDPR Compliance

```typescript
// User consent management
await analytics.setUserConsent({
  userId: 'user-123',
  analytics: true,
  marketing: false,
  personalization: true
});

// Data deletion request
await analytics.deleteUserData('user-123');

// Data export request
const userData = await analytics.exportUserData('user-123');
```

### CCPA Compliance

```typescript
// Opt-out tracking
await analytics.setDoNotTrack('user-123', true);

// Data access request
const accessData = await analytics.getUserData('user-123');
```

## 📈 Performance Tips

### 1. Batch Event Tracking

```typescript
// Instead of tracking events individually
for (const item of items) {
  await analytics.trackEvent({
    userId: item.userId,
    eventType: 'item_view',
    properties: { itemId: item.id }
  });
}

// Use batch tracking
const events = items.map(item => ({
  userId: item.userId,
  eventType: 'item_view',
  properties: { itemId: item.id }
}));

await analytics.trackBatchEvents(events);
```

### 2. Caching Strategy

```typescript
// Cache frequently accessed data
const cache = new Map();

async function getUserMetrics(userId: string) {
  const cacheKey = `metrics:${userId}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const metrics = await analytics.getUserMetrics(userId);
  cache.set(cacheKey, metrics);
  
  // Clear cache after 5 minutes
  setTimeout(() => cache.delete(cacheKey), 5 * 60 * 1000);
  
  return metrics;
}
```

### 3. Real-time Updates

```typescript
// Use WebSocket for real-time updates
const socket = new WebSocket('ws://localhost:3001/analytics');

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'metric_update') {
    updateDashboard(data.metrics);
  }
};
```

## 🛠️ Development Workflow

### 1. Local Development

```bash
# Start development server
npm run dev

# Run tests in watch mode
npm run test:watch

# Start database services
docker-compose -f docker-compose.dev.yml up
```

### 2. Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- AnalyticsService.test.ts

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### 3. Building for Production

```bash
# Build application
npm run build

# Preview production build
npm run preview

# Build Docker image
docker build -t my-analytics-app .
```

## 🚀 Deployment

### 1. Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose logs -f analytics
```

### 2. Cloud Deployment

```bash
# Deploy to Vercel
vercel --prod

# Deploy to Heroku
git push heroku main

# Deploy to AWS
aws s3 sync build/ s3://your-bucket
```

### 3. Kubernetes

```bash
# Apply Kubernetes configuration
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -l app=analytics

# View logs
kubectl logs -f deployment/analytics
```

## 🔧 Configuration Reference

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment | `development` | Yes |
| `PORT` | Server port | `3000` | No |
| `DATABASE_URL` | Database connection | - | Yes |
| `REDIS_URL` | Redis connection | - | Yes |
| `JWT_SECRET` | JWT secret key | - | Yes |
| `USE_NEW_ARCHITECTURE` | Enable new architecture | `false` | No |

### Feature Flags

| Flag | Description | Default |
|------|-------------|---------|
| `USE_DI_ANALYTICS` | Enable DI analytics | `false` |
| `USE_DI_NOTIFICATIONS` | Enable notifications | `false` |
| `USE_DI_CONTENT` | Enable content analytics | `false` |
| `PERFORMANCE_MONITORING` | Enable performance monitoring | `false` |

## 🆘 Troubleshooting

### Common Issues

#### 1. Installation Problems

**Problem:** `npm install` fails with dependency errors

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

#### 2. Database Connection Issues

**Problem:** Cannot connect to PostgreSQL

**Solution:**
```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# Check connection string
psql "postgresql://user:password@localhost:5432/analytics"

# Update .env file with correct credentials
```

#### 3. Redis Connection Issues

**Problem:** Cannot connect to Redis

**Solution:**
```bash
# Check if Redis is running
redis-cli ping

# Start Redis server
redis-server

# Check Redis configuration
redis-cli config get "*"
```

#### 4. Port Already in Use

**Problem:** Port 3000 is already in use

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

#### 5. TypeScript Errors

**Problem:** TypeScript compilation errors

**Solution:**
```bash
# Check TypeScript version
npx tsc --version

# Update TypeScript
npm install typescript@latest

# Check configuration
npx tsc --noEmit
```

### Debug Mode

Enable debug mode for detailed logging:

```bash
# Set debug environment
export DEBUG=analytics:*
export LOG_LEVEL=debug

# Run with debug flags
npm run dev
```

### Getting Help

If you're still having trouble:

1. **Check the logs:** Look for error messages in the console
2. **Search issues:** Check [GitHub Issues](https://github.com/quietspace/analytics/issues)
3. **Join the community:** [Discord Server](https://discord.gg/quietspace)
4. **Contact support:** analytics-support@quietspace.com

## 🎓 Next Steps

### Learn More

- **[API Documentation](./API.md)** - Complete API reference
- **[Component Guide](./Components.md)** - Component usage examples
- **[Integration Guide](./Integration.md)** - Cross-feature integration
- **[Performance Guide](./Performance.md)** - Performance optimization

### Advanced Topics

- **Custom Metrics** - Create your own metrics
- **Advanced Visualizations** - Build custom charts
- **Machine Learning** - Implement custom ML models
- **Real-time Analytics** - Build real-time features

### Community

- **GitHub:** [github.com/quietspace/analytics](https://github.com/quietspace/analytics)
- **Documentation:** [docs.quietspace.com/analytics](https://docs.quietspace.com/analytics)
- **Community Forum:** [community.quietspace.com](https://community.quietspace.com)
- **Twitter:** [@QuietSpaceDev](https://twitter.com/QuietSpaceDev)

---

**🎉 Congratulations! You've successfully set up QuietSpace Analytics.**

Ready to dive deeper? Check out our [advanced guides](./Advanced.md) or join our [community](https://community.quietspace.com) to connect with other developers.
