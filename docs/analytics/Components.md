# Analytics Components Documentation

## Overview

The Analytics components provide a comprehensive suite of React components for building analytics dashboards, reports, and data visualizations. All components are built with TypeScript, use the DI system for service integration, and follow modern React patterns.

## Table of Contents

1. [Installation](#installation)
2. [Setup](#setup)
3. [Core Components](#core-components)
4. [Advanced Components](#advanced-components)
5. [Performance Components](#performance-components)
6. [Styling](#styling)
7. [Examples](#examples)
8. [Migration Guide](#migration-guide)

## Installation

```bash
npm install @quietspace/analytics-components
# or
yarn add @quietspace/analytics-components
```

## Setup

### DI Provider Setup

Wrap your application with the DI provider to enable analytics services:

```tsx
import { DIProvider } from '@quietspace/core/di';
import { initializeAnalyticsContainer } from '@quietspace/analytics/di';

const container = initializeAnalyticsContainer();

function App() {
  return (
    <DIProvider container={container}>
      <YourApp />
    </DIProvider>
  );
}
```

### Feature Flags

Enable analytics features using environment variables:

```bash
REACT_APP_USE_DI_ANALYTICS=true
REACT_APP_USE_NEW_ARCHITECTURE=true
```

## Core Components

### AnalyticsDashboard

The main analytics dashboard component with real-time metrics and interactive widgets.

#### Props

```typescript
interface AnalyticsDashboardProps {
  userId: string;
  timeframe?: '1d' | '7d' | '30d' | '90d';
  autoRefresh?: boolean;
  refreshInterval?: number;
  className?: string;
  onMetricClick?: (metric: string, value: number) => void;
  onTimeframeChange?: (timeframe: string) => void;
}
```

#### Basic Usage

```tsx
import { AnalyticsDashboard } from '@quietspace/analytics-components';

function Dashboard() {
  return (
    <AnalyticsDashboard 
      userId="user-123"
      timeframe="7d"
      autoRefresh={true}
      refreshInterval={30000}
      onMetricClick={(metric, value) => {
        console.log(`${metric}: ${value}`);
      }}
    />
  );
}
```

#### Advanced Usage with Custom Handlers

```tsx
import { AnalyticsDashboard } from '@quietspace/analytics-components';

function AdvancedDashboard() {
  const handleMetricClick = (metric: string, value: number) => {
    // Navigate to detailed view
    navigate(`/analytics/metrics/${metric}`);
  };

  const handleTimeframeChange = (timeframe: string) => {
    // Update URL or state
    setTimeframe(timeframe);
  };

  return (
    <div className="dashboard-container">
      <AnalyticsDashboard
        userId={currentUser.id}
        timeframe={timeframe}
        autoRefresh={true}
        onMetricClick={handleMetricClick}
        onTimeframeChange={handleTimeframeChange}
      />
    </div>
  );
}
```

### AdvancedCharts

Interactive chart component with multiple chart types and real-time data.

#### Props

```typescript
interface AdvancedChartsProps {
  data: ChartData[];
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  title?: string;
  subtitle?: string;
  height?: number;
  responsive?: boolean;
  interactive?: boolean;
  onDataPointClick?: (point: ChartDataPoint) => void;
  onLegendClick?: (series: string) => void;
}
```

#### Basic Usage

```tsx
import { AdvancedCharts } from '@quietspace/analytics-components';

function ChartExample() {
  const chartData = [
    { date: '2024-01-01', pageViews: 1000, users: 500 },
    { date: '2024-01-02', pageViews: 1200, users: 600 },
    { date: '2024-01-03', pageViews: 900, users: 450 },
  ];

  return (
    <AdvancedCharts
      data={chartData}
      type="line"
      title="Page Views Trend"
      height={400}
      interactive={true}
      onDataPointClick={(point) => {
        console.log('Clicked:', point);
      }}
    />
  );
}
```

#### Multiple Chart Types

```tsx
function MultipleCharts() {
  const data = [
    { category: 'Desktop', value: 45, percentage: 45 },
    { category: 'Mobile', value: 35, percentage: 35 },
    { category: 'Tablet', value: 20, percentage: 20 },
  ];

  return (
    <div className="charts-grid">
      <AdvancedCharts
        data={data}
        type="pie"
        title="Device Distribution"
        height={300}
      />
      <AdvancedCharts
        data={data}
        type="bar"
        title="Device Usage"
        height={300}
      />
    </div>
  );
}
```

### ReportBuilder

Drag-and-drop report builder with customizable templates and scheduling.

#### Props

```typescript
interface ReportBuilderProps {
  userId: string;
  onSave?: (report: AnalyticsReport) => void;
  onPreview?: (report: AnalyticsReport) => void;
  templates?: ReportTemplate[];
  className?: string;
}
```

#### Basic Usage

```tsx
import { ReportBuilder } from '@quietspace/analytics-components';

function ReportsPage() {
  const handleSaveReport = (report: AnalyticsReport) => {
    // Save report to backend
    saveReport(report);
  };

  const handlePreviewReport = (report: AnalyticsReport) => {
    // Show preview modal
    setPreviewReport(report);
  };

  return (
    <ReportBuilder
      userId={currentUser.id}
      onSave={handleSaveReport}
      onPreview={handlePreviewReport}
    />
  );
}
```

#### Custom Templates

```tsx
function CustomReportBuilder() {
  const customTemplates = [
    {
      id: 'custom-1',
      name: 'Executive Summary',
      type: 'summary' as const,
      sections: ['overview', 'metrics', 'insights'],
      branding: {
        primaryColor: '#007bff',
        secondaryColor: '#6c757d',
        fontFamily: 'Arial',
        includeWatermark: true
      }
    }
  ];

  return (
    <ReportBuilder
      userId={currentUser.id}
      templates={customTemplates}
      onSave={handleSave}
    />
  );
}
```

### PredictiveAnalytics

AI-powered predictive analytics with forecasting and A/B testing.

#### Props

```typescript
interface PredictiveAnalyticsProps {
  userId: string;
  models?: PredictionModel[];
  timeHorizon?: number;
  confidenceThreshold?: number;
  onPredictionUpdate?: (predictions: Prediction[]) => void;
}
```

#### Basic Usage

```tsx
import { PredictiveAnalytics } from '@quietspace/analytics-components';

function PredictiveDashboard() {
  return (
    <PredictiveAnalytics
      userId={currentUser.id}
      models={['traffic', 'engagement', 'conversion']}
      timeHorizon={30}
      confidenceThreshold={0.8}
      onPredictionUpdate={(predictions) => {
        console.log('Updated predictions:', predictions);
      }}
    />
  );
}
```

## Advanced Components

### PerformanceMonitor

Real-time system performance monitoring with alerts and recommendations.

#### Props

```typescript
interface PerformanceMonitorProps {
  userId: string;
  refreshInterval?: number;
  alertThresholds?: AlertThresholds;
  onAlert?: (alert: PerformanceAlert) => void;
}
```

#### Usage

```tsx
import { PerformanceMonitor } from '@quietspace/analytics-components';

function PerformancePage() {
  const handleAlert = (alert: PerformanceAlert) => {
    // Send notification
    showNotification({
      type: 'warning',
      message: alert.message,
      action: 'View Details'
    });
  };

  return (
    <PerformanceMonitor
      userId={currentUser.id}
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

### CacheManager

Multi-level cache management with performance optimization.

#### Props

```typescript
interface CacheManagerProps {
  userId: string;
  cacheTypes?: CacheType[];
  onCacheUpdate?: (stats: CacheStats) => void;
}
```

#### Usage

```tsx
import { CacheManager } from '@quietspace/analytics-components';

function CachePage() {
  return (
    <CacheManager
      userId={currentUser.id}
      cacheTypes={['memory', 'redis', 'database']}
      onCacheUpdate={(stats) => {
        console.log('Cache stats updated:', stats);
      }}
    />
  );
}
```

### ErrorTracker

Comprehensive error tracking and recovery system.

#### Props

```typescript
interface ErrorTrackerProps {
  userId: string;
  errorTypes?: ErrorType[];
  autoRecovery?: boolean;
  onErrorResolved?: (error: ErrorEvent) => void;
}
```

#### Usage

```tsx
import { ErrorTracker } from '@quietspace/analytics-components';

function ErrorTrackingPage() {
  return (
    <ErrorTracker
      userId={currentUser.id}
      errorTypes={['critical', 'warning', 'info']}
      autoRecovery={true}
      onErrorResolved={(error) => {
        console.log('Error resolved:', error);
      }}
    />
  );
}
```

### CrossFeatureAnalytics

Unified analytics dashboard showing cross-feature insights.

#### Props

```typescript
interface CrossFeatureAnalyticsProps {
  userId: string;
  features?: string[];
  timeRange?: DateRange;
  onInsightClick?: (insight: CrossFeatureInsight) => void;
}
```

#### Usage

```tsx
import { CrossFeatureAnalytics } from '@quietspace/analytics-components';

function CrossFeaturePage() {
  return (
    <CrossFeatureAnalytics
      userId={currentUser.id}
      features={['notifications', 'content', 'analytics']}
      timeRange={{
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date()
      }}
      onInsightClick={(insight) => {
        navigate(`/insights/${insight.id}`);
      }}
    />
  );
}
```

## Styling

### Theme Integration

Components use JSS for styling and integrate with the existing theme system:

```tsx
import { createTheme } from '@quietspace/core/theme';

const theme = createTheme({
  analytics: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    background: '#f8f9fa',
    surface: '#ffffff'
  }
});
```

### Custom Styling

Override component styles using the `className` prop:

```tsx
<AnalyticsDashboard 
  userId="user-123"
  className="custom-dashboard"
/>

// CSS
.custom-dashboard {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### Style Overrides

Use the theme to override component styles:

```tsx
const customTheme = {
  analytics: {
    dashboard: {
      container: {
        backgroundColor: '#ffffff',
        borderRadius: '12px'
      },
      metricCard: {
        padding: '20px',
        border: '1px solid #e1e4e8'
      }
    }
  }
};
```

## Examples

### Complete Analytics Dashboard

```tsx
import React, { useState } from 'react';
import {
  AnalyticsDashboard,
  AdvancedCharts,
  PredictiveAnalytics,
  PerformanceMonitor,
  CrossFeatureAnalytics
} from '@quietspace/analytics-components';

function CompleteAnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  return (
    <div className="analytics-dashboard">
      <header className="dashboard-header">
        <h1>Analytics Dashboard</h1>
        <div className="timeframe-selector">
          {['1d', '7d', '30d', '90d'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={timeframe === tf ? 'active' : ''}
            >
              {tf}
            </button>
          ))}
        </div>
      </header>

      <main className="dashboard-content">
        <section className="main-metrics">
          <AnalyticsDashboard
            userId={currentUser.id}
            timeframe={timeframe}
            onMetricClick={setSelectedMetric}
          />
        </section>

        <section className="charts-section">
          <AdvancedCharts
            data={chartData}
            type="line"
            title="Trend Analysis"
            height={400}
          />
        </section>

        <section className="predictive-section">
          <PredictiveAnalytics
            userId={currentUser.id}
            timeHorizon={30}
          />
        </section>

        <section className="performance-section">
          <PerformanceMonitor
            userId={currentUser.id}
            refreshInterval={10000}
          />
        </section>

        <section className="cross-feature-section">
          <CrossFeatureAnalytics
            userId={currentUser.id}
            features={['notifications', 'content', 'analytics']}
          />
        </section>
      </main>
    </div>
  );
}
```

### Interactive Report Builder

```tsx
import React, { useState } from 'react';
import { ReportBuilder } from '@quietspace/analytics-components';

function InteractiveReportBuilder() {
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  const handleSave = (savedReport: AnalyticsReport) => {
    setReport(savedReport);
    // Show success message
    showNotification('Report saved successfully!');
  };

  const handlePreview = (previewReport: AnalyticsReport) => {
    setReport(previewReport);
    setIsPreview(true);
  };

  return (
    <div className="report-builder-page">
      <div className="builder-container">
        <ReportBuilder
          userId={currentUser.id}
          onSave={handleSave}
          onPreview={handlePreview}
        />
      </div>

      {isPreview && report && (
        <div className="preview-modal">
          <div className="preview-content">
            <h2>Report Preview</h2>
            <ReportPreview report={report} />
            <div className="preview-actions">
              <button onClick={() => setIsPreview(false)}>
                Close Preview
              </button>
              <button onClick={() => downloadReport(report)}>
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Migration Guide

### From Legacy Components

If you're migrating from legacy analytics components:

1. **Update Imports:**
   ```tsx
   // Old
   import { AnalyticsDashboard } from '../legacy/analytics';
   
   // New
   import { AnalyticsDashboard } from '@quietspace/analytics-components';
   ```

2. **Update Props:**
   ```tsx
   // Old
   <AnalyticsDashboard user={user} />
   
   // New
   <AnalyticsDashboard userId={user.id} />
   ```

3. **Add DI Provider:**
   ```tsx
   // Wrap your app with DI provider
   <DIProvider container={container}>
     <App />
   </DIProvider>
   ```

### Breaking Changes

- `user` prop renamed to `userId`
- `onDataUpdate` renamed to `onMetricClick`
- All components now require DI provider
- Style system changed from CSS modules to JSS

### Performance Considerations

- Components use React.memo for optimization
- Data fetching is debounced and cached
- Charts use virtualization for large datasets
- Real-time updates use WebSocket connections

## Best Practices

### Component Usage

1. **Always provide userId prop** - Required for data isolation
2. **Use appropriate refresh intervals** - Avoid excessive API calls
3. **Implement error boundaries** - Handle component failures gracefully
4. **Optimize chart data** - Limit data points for better performance

### Performance

1. **Use React.memo** for components with expensive renders
2. **Implement virtual scrolling** for large data sets
3. **Debounce user interactions** to reduce API calls
4. **Use the DI container** for efficient service management

### Accessibility

1. **Provide ARIA labels** for interactive elements
2. **Ensure keyboard navigation** works for all components
3. **Use semantic HTML** for better screen reader support
4. **Test with accessibility tools** before deployment

## Troubleshooting

### Common Issues

1. **Components not rendering:**
   - Check DI provider setup
   - Verify feature flags are enabled
   - Ensure userId is provided

2. **Data not loading:**
   - Check network requests in browser dev tools
   - Verify API endpoints are accessible
   - Check authentication tokens

3. **Performance issues:**
   - Reduce refresh intervals
   - Limit chart data points
   - Use React.memo for optimization

### Debug Mode

Enable debug mode for detailed logging:

```tsx
const container = initializeAnalyticsContainer({
  debug: true,
  logLevel: 'verbose'
});
```

## Support

For component support:
- **Documentation:** https://docs.quietspace.com/analytics/components
- **GitHub Issues:** https://github.com/quietspace/analytics-components/issues
- **Community:** https://community.quietspace.com/analytics
