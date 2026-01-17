# Analytics API Documentation

## Overview

The Analytics API provides comprehensive data tracking, metrics calculation, dashboard management, and insights generation for the QuietSpace platform. This document covers all available endpoints, data structures, and usage examples.

## Table of Contents

1. [Authentication](#authentication)
2. [Base URL](#base-url)
3. [Event Tracking](#event-tracking)
4. [Metrics](#metrics)
5. [Dashboards](#dashboards)
6. [Reports](#reports)
7. [Insights](#insights)
8. [Predictive Analytics](#predictive-analytics)
9. [Performance Monitoring](#performance-monitoring)
10. [Error Handling](#error-handling)

## Authentication

All API requests require authentication using JWT tokens. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## Base URL

```
https://api.quietspace.com/analytics/v1
```

## Event Tracking

### Track Event

Track a single analytics event.

**Endpoint:** `POST /events`

**Request Body:**
```typescript
interface AnalyticsEvent {
  userId: string;
  sessionId: string;
  eventType: 'page_view' | 'click' | 'form_submit' | 'feature_usage' | 'error' | 'conversion';
  timestamp: Date;
  metadata: {
    userAgent: string;
    platform: 'web' | 'mobile' | 'desktop';
    browser: string;
    version: string;
    language: string;
    timezone: string;
    screenResolution: string;
    deviceType: 'desktop' | 'mobile' | 'tablet';
    ipAddress: string;
  };
  properties: Record<string, any>;
  source: 'web' | 'mobile' | 'api';
}
```

**Example Request:**
```javascript
const event = {
  userId: 'user-123',
  sessionId: 'session-456',
  eventType: 'page_view',
  timestamp: new Date(),
  metadata: {
    userAgent: 'Mozilla/5.0...',
    platform: 'web',
    browser: 'chrome',
    version: '120.0.0',
    language: 'en',
    timezone: 'UTC',
    screenResolution: '1920x1080',
    deviceType: 'desktop',
    ipAddress: '192.168.1.1'
  },
  properties: {
    page: '/dashboard',
    referrer: '/login'
  },
  source: 'web'
};

fetch('/analytics/v1/events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <token>'
  },
  body: JSON.stringify(event)
});
```

**Response:**
```typescript
interface EventResponse {
  id: string;
  success: boolean;
  timestamp: Date;
}
```

### Track Batch Events

Track multiple events in a single request.

**Endpoint:** `POST /events/batch`

**Request Body:**
```typescript
interface BatchEventRequest {
  events: Omit<AnalyticsEvent, 'id'>[];
}
```

**Example Request:**
```javascript
const batchRequest = {
  events: [
    {
      userId: 'user-123',
      sessionId: 'session-456',
      eventType: 'page_view',
      timestamp: new Date(),
      metadata: { /* ... */ },
      properties: { page: '/dashboard' },
      source: 'web'
    },
    {
      userId: 'user-123',
      sessionId: 'session-456',
      eventType: 'click',
      timestamp: new Date(),
      metadata: { /* ... */ },
      properties: { element: 'nav-button' },
      source: 'web'
    }
  ]
};

fetch('/analytics/v1/events/batch', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <token>'
  },
  body: JSON.stringify(batchRequest)
});
```

## Metrics

### Get Metrics

Retrieve analytics metrics for a specific date range and filters.

**Endpoint:** `GET /metrics`

**Query Parameters:**
```typescript
interface MetricsQuery {
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  userId?: string;
  contentType?: string;
  eventTypes?: string[];
  dimensions?: string[];
  metrics?: string[];
  segments?: string[];
}
```

**Example Request:**
```javascript
const params = new URLSearchParams({
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-01-31T23:59:59Z',
  eventTypes: 'page_view,click',
  metrics: 'pageViews,uniqueUsers,bounceRate'
});

fetch(`/analytics/v1/metrics?${params}`, {
  headers: {
    'Authorization': 'Bearer <token>'
  }
});
```

**Response:**
```typescript
interface AnalyticsMetrics {
  pageViews: number;
  uniqueUsers: number;
  totalSessions: number;
  bounceRate: number;
  averageSessionDuration: number;
  conversionRate: number;
  topPages: Array<{
    page: string;
    views: number;
    uniqueViews: number;
  }>;
  topEvents: Array<{
    eventType: string;
    count: number;
    uniqueUsers: number;
  }>;
  userSegments: Array<{
    segment: string;
    count: number;
    percentage: number;
  }>;
  timeSeriesData: Array<{
    date: string;
    pageViews: number;
    uniqueUsers: number;
    sessions: number;
  }>;
}
```

### Get Real-time Metrics

Get current real-time analytics data.

**Endpoint:** `GET /metrics/realtime`

**Response:**
```typescript
interface RealtimeMetrics {
  activeUsers: number;
  currentPageViews: number;
  currentSessions: number;
  recentEvents: AnalyticsEvent[];
  topPages: Array<{
    page: string;
    activeUsers: number;
  }>;
}
```

## Dashboards

### Create Dashboard

Create a new analytics dashboard.

**Endpoint:** `POST /dashboards`

**Request Body:**
```typescript
interface CreateDashboardRequest {
  name: string;
  description?: string;
  widgets: DashboardWidget[];
  layout: DashboardLayout;
  filters: DashboardFilters;
  isPublic: boolean;
  isDefault: boolean;
}

interface DashboardWidget {
  id: string;
  type: 'metric_card' | 'chart' | 'table' | 'text';
  title: string;
  description?: string;
  dataSource: 'analytics' | 'custom';
  metrics: string[];
  filters: {
    dateRange: DateRange;
    customFilters: Record<string, any>;
  };
  visualization: {
    chartType: 'line' | 'bar' | 'pie' | 'metric';
    aggregation: 'sum' | 'avg' | 'count' | 'max' | 'min';
  };
  position: { x: number; y: number };
  size: { width: number; height: number };
  refreshInterval?: number;
}
```

**Example Request:**
```javascript
const dashboard = {
  name: 'User Engagement Dashboard',
  description: 'Track user engagement metrics',
  widgets: [
    {
      id: 'widget-1',
      type: 'metric_card',
      title: 'Total Page Views',
      description: 'Total page views in the selected period',
      dataSource: 'analytics',
      metrics: ['pageViews'],
      filters: {
        dateRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-01-31'),
          preset: 'last_30_days'
        },
        customFilters: {}
      },
      visualization: {
        chartType: 'metric',
        aggregation: 'sum'
      },
      position: { x: 0, y: 0 },
      size: { width: 4, height: 2 },
      refreshInterval: 30000
    }
  ],
  layout: {
    columns: 12,
    rowHeight: 100,
    margin: [10, 10],
    containerPadding: [10, 10]
  },
  filters: {
    globalDateRange: {
      start: new Date('2024-01-01'),
      end: new Date('2024-01-31'),
      preset: 'last_30_days'
    },
    customFilters: {}
  },
  isPublic: false,
  isDefault: false
};

fetch('/analytics/v1/dashboards', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <token>'
  },
  body: JSON.stringify(dashboard)
});
```

### Get User Dashboards

Retrieve all dashboards for the authenticated user.

**Endpoint:** `GET /dashboards`

**Response:**
```typescript
interface DashboardListResponse {
  dashboards: AnalyticsDashboard[];
  total: number;
}
```

### Update Dashboard

Update an existing dashboard.

**Endpoint:** `PUT /dashboards/:id`

### Delete Dashboard

Delete a dashboard.

**Endpoint:** `DELETE /dashboards/:id`

## Reports

### Generate Report

Generate a report based on specified parameters.

**Endpoint:** `POST /reports/generate`

**Request Body:**
```typescript
interface GenerateReportRequest {
  id: string;
  userId: string;
  name: string;
  description?: string;
  type: 'summary' | 'trend' | 'detailed' | 'custom';
  schedule: {
    frequency: 'on_demand' | 'daily' | 'weekly' | 'monthly';
    time: string;
    timezone: string;
  };
  recipients: string[];
  template: {
    sections: ReportSection[];
    branding: ReportBranding;
  };
  filters: {
    dateRange: DateRange;
    dimensions: string[];
    metrics: string[];
    segments: string[];
  };
  format: 'pdf' | 'excel' | 'csv';
  isActive: boolean;
}
```

**Response:**
```typescript
interface ReportResponse {
  id: string;
  status: 'generating' | 'completed' | 'failed';
  downloadUrl?: string;
  data?: any;
  error?: string;
}
```

### Get Report Data

Retrieve data for a specific report.

**Endpoint:** `GET /reports/:id/data`

## Insights

### Generate Insights

Generate AI-powered insights from analytics data.

**Endpoint:** `POST /insights/generate`

**Request Body:**
```typescript
interface GenerateInsightsRequest {
  dateRange: DateRange;
  metrics?: string[];
  dimensions?: string[];
  confidenceThreshold?: number;
}
```

**Response:**
```typescript
interface AnalyticsInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'warning';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  recommendations: string[];
  data: {
    metric: string;
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  createdAt: Date;
}
```

### Get Insights

Retrieve insights for a specific date range.

**Endpoint:** `GET /insights`

## Predictive Analytics

### Get Predictions

Retrieve ML-powered predictions for various metrics.

**Endpoint:** `GET /predictions`

**Query Parameters:**
```typescript
interface PredictionsQuery {
  model: 'traffic' | 'engagement' | 'conversion' | 'retention';
  horizon: number; // days to predict
  confidence?: number;
}
```

**Response:**
```typescript
interface PredictionResponse {
  model: string;
  predictions: Array<{
    date: string;
    value: number;
    confidence: number;
    upperBound: number;
    lowerBound: number;
  }>;
  accuracy: number;
  influencingFactors: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
}
```

### A/B Testing

Manage A/B tests and analyze results.

**Endpoint:** `POST /ab-tests`

**Request Body:**
```typescript
interface CreateABTestRequest {
  name: string;
  description?: string;
  trafficSplit: number; // percentage for variant A
  variants: {
    A: { name: string; config: any };
    B: { name: string; config: any };
  };
  successMetric: string;
  duration: number; // days
  confidenceLevel: number;
}
```

## Performance Monitoring

### Get System Performance

Retrieve system performance metrics.

**Endpoint:** `GET /performance/system`

**Response:**
```typescript
interface SystemPerformance {
  responseTime: {
    average: number;
    p50: number;
    p95: number;
    p99: number;
  };
  throughput: {
    requestsPerSecond: number;
    requestsPerMinute: number;
  };
  errorRate: {
    total: number;
    percentage: number;
    byType: Record<string, number>;
  };
  resourceUsage: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
}
```

### Get Feature Performance

Get performance metrics for specific features.

**Endpoint:** `GET /performance/features`

**Response:**
```typescript
interface FeaturePerformance {
  features: Array<{
    name: string;
    responseTime: number;
    throughput: number;
    errorRate: number;
    userSatisfaction: number;
    status: 'healthy' | 'warning' | 'critical';
  }>;
}
```

## Error Handling

### Error Response Format

All API errors follow this format:

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: Date;
    requestId: string;
  };
}
```

### Common Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `INVALID_REQUEST` | Request validation failed | 400 |
| `UNAUTHORIZED` | Authentication required | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `RATE_LIMITED` | Too many requests | 429 |
| `INTERNAL_ERROR` | Server error | 500 |
| `SERVICE_UNAVAILABLE` | Service temporarily unavailable | 503 |

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Standard tier:** 1000 requests per hour
- **Premium tier:** 10,000 requests per hour
- **Enterprise tier:** Unlimited

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Pagination

List endpoints support pagination:

```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

## SDKs and Libraries

### JavaScript/TypeScript

```bash
npm install @quietspace/analytics-sdk
```

```typescript
import { AnalyticsClient } from '@quietspace/analytics-sdk';

const client = new AnalyticsClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.quietspace.com/analytics/v1'
});

// Track event
await client.trackEvent({
  userId: 'user-123',
  eventType: 'page_view',
  properties: { page: '/dashboard' }
});

// Get metrics
const metrics = await client.getMetrics({
  startDate: '2024-01-01',
  endDate: '2024-01-31'
});
```

### Python

```bash
pip install quietspace-analytics
```

```python
from quietspace_analytics import AnalyticsClient

client = AnalyticsClient(
    api_key='your-api-key',
    base_url='https://api.quietspace.com/analytics/v1'
)

# Track event
client.track_event(
    user_id='user-123',
    event_type='page_view',
    properties={'page': '/dashboard'}
)

# Get metrics
metrics = client.get_metrics(
    start_date='2024-01-01',
    end_date='2024-01-31'
)
```

## Webhooks

Configure webhooks to receive real-time analytics events:

```typescript
interface WebhookConfig {
  url: string;
  events: string[];
  secret: string;
  active: boolean;
}
```

**Supported Events:**
- `event.created`
- `dashboard.created`
- `report.generated`
- `insight.generated`
- `alert.triggered`

## Support

For API support and questions:
- **Documentation:** https://docs.quietspace.com/analytics
- **Support Email:** analytics-support@quietspace.com
- **Status Page:** https://status.quietspace.com
- **GitHub Issues:** https://github.com/quietspace/analytics/issues
