export interface AnalyticsEntity {
  id: string;
  userId?: string;
  contentId?: string;
  eventType: AnalyticsEventType;
  timestamp: Date;
  sessionId: string;
  metadata: AnalyticsMetadata;
  properties: AnalyticsProperties;
  value?: number;
  source: AnalyticsSource;
}

export type AnalyticsEventType = 
  | 'page_view'
  | 'content_view'
  | 'content_like'
  | 'content_share'
  | 'content_comment'
  | 'user_login'
  | 'user_logout'
  | 'user_register'
  | 'search_query'
  | 'media_upload'
  | 'notification_click'
  | 'feature_usage'
  | 'error_occurred'
  | 'performance_metric';

export interface AnalyticsMetadata {
  userAgent: string;
  platform: string;
  browser: string;
  version: string;
  language: string;
  timezone: string;
  screenResolution: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  ipAddress: string;
  location?: GeoLocation;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface GeoLocation {
  country: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface AnalyticsProperties {
  [key: string]: any;
  contentType?: string;
  contentCategory?: string;
  searchQuery?: string;
  errorMessage?: string;
  loadTime?: number;
  responseTime?: number;
  statusCode?: number;
  featureName?: string;
  actionType?: string;
  targetElement?: string;
  duration?: number;
}

export type AnalyticsSource = 'web' | 'mobile' | 'api' | 'background';

export interface AnalyticsMetrics {
  totalEvents: number;
  uniqueUsers: number;
  totalSessions: number;
  averageSessionDuration: number;
  bounceRate: number;
  pageViews: number;
  contentViews: number;
  userEngagement: number;
  conversionRate: number;
  errorRate: number;
  performanceScore: number;
}

export interface AnalyticsDashboard {
  id: string;
  userId: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  layout: DashboardLayout;
  filters: DashboardFilters;
  isDefault: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  description: string;
  dataSource: string;
  metrics: string[];
  filters: WidgetFilters;
  visualization: VisualizationConfig;
  position: WidgetPosition;
  size: WidgetSize;
  refreshInterval: number;
}

export type WidgetType = 
  | 'metric_card'
  | 'line_chart'
  | 'bar_chart'
  | 'pie_chart'
  | 'table'
  | 'funnel_chart'
  | 'heatmap'
  | 'gauge'
  | 'progress_bar'
  | 'list';

export interface WidgetFilters {
  dateRange: DateRange;
  eventType?: AnalyticsEventType;
  contentType?: string;
  userId?: string;
  customFilters: Record<string, any>;
}

export interface DateRange {
  start: Date;
  end: Date;
  preset?: 'today' | 'yesterday' | 'last_24_hours' | 'last_7_days' | 'last_30_days' | 'last_90_days' | 'custom';
}

export interface VisualizationConfig {
  chartType: string;
  xAxis?: string;
  yAxis?: string;
  groupBy?: string;
  aggregation?: 'sum' | 'average' | 'count' | 'min' | 'max';
  colorScheme?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  maxDataPoints?: number;
}

export interface WidgetPosition {
  x: number;
  y: number;
}

export interface WidgetSize {
  width: number;
  height: number;
}

export interface DashboardLayout {
  columns: number;
  rowHeight: number;
  margin: [number, number];
  containerPadding: [number, number];
}

export interface DashboardFilters {
  globalDateRange: DateRange;
  userFilters?: string[];
  contentFilters?: string[];
  eventFilters?: AnalyticsEventType[];
  customFilters: Record<string, any>;
}

export interface AnalyticsReport {
  id: string;
  userId: string;
  name: string;
  description: string;
  type: ReportType;
  schedule: ReportSchedule;
  recipients: string[];
  template: ReportTemplate;
  filters: ReportFilters;
  format: ReportFormat;
  isActive: boolean;
  lastGenerated?: Date;
  nextGeneration?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ReportType = 'summary' | 'detailed' | 'trend' | 'comparison' | 'custom';

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'on_demand';
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  time: string; // HH:MM format
  timezone: string;
}

export interface ReportTemplate {
  sections: ReportSection[];
  branding: ReportBranding;
}

export interface ReportSection {
  id: string;
  type: 'header' | 'summary' | 'chart' | 'table' | 'text' | 'footer';
  title: string;
  content: string;
  dataSource?: string;
  visualization?: VisualizationConfig;
  order: number;
}

export interface ReportBranding {
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  includeWatermark: boolean;
  customFooter?: string;
}

export interface ReportFilters {
  dateRange: DateRange;
  dimensions: string[];
  metrics: string[];
  segments: ReportSegment[];
}

export interface ReportSegment {
  name: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than';
  value: any;
}

export type ReportFormat = 'pdf' | 'excel' | 'csv' | 'json' | 'html';

export interface AnalyticsInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  trend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  value: number;
  previousValue: number;
  changePercentage: number;
  timeframe: string;
  recommendations: string[];
  detectedAt: Date;
  expiresAt?: Date;
}

export type InsightType = 
  | 'traffic_spike'
  | 'engagement_drop'
  | 'conversion_change'
  | 'performance_issue'
  | 'content_trend'
  | 'user_behavior'
  | 'error_pattern'
  | 'opportunity'
  | 'risk';

export interface AnalyticsFunnel {
  id: string;
  name: string;
  description: string;
  steps: FunnelStep[];
  conversionRates: FunnelConversion[];
  timeAnalysis: FunnelTimeAnalysis;
  createdAt: Date;
  updatedAt: Date;
}

export interface FunnelStep {
  id: string;
  name: string;
  description: string;
  eventType: AnalyticsEventType;
  conditions: FunnelCondition[];
  order: number;
  isRequired: boolean;
}

export interface FunnelCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'exists' | 'not_exists';
  value: any;
}

export interface FunnelConversion {
  stepId: string;
  stepName: string;
  users: number;
  conversionRate: number;
  dropoffRate: number;
  averageTime: number;
}

export interface FunnelTimeAnalysis {
  totalAverageTime: number;
  stepTimes: Record<string, number>;
  bottlenecks: string[];
}

export interface AnalyticsGoal {
  id: string;
  name: string;
  description: string;
  type: GoalType;
  target: GoalTarget;
  progress: GoalProgress;
  timeframe: DateRange;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type GoalType = 'traffic' | 'engagement' | 'conversion' | 'retention' | 'performance' | 'custom';

export interface GoalTarget {
  metric: string;
  operator: 'greater_than' | 'less_than' | 'equals' | 'percentage_increase' | 'percentage_decrease';
  value: number;
  currentValue: number;
}

export interface GoalProgress {
  current: number;
  target: number;
  percentage: number;
  isAchieved: boolean;
  achievedAt?: Date;
}
