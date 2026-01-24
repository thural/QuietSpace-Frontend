import { AnalyticsEntity, AnalyticsMetrics, AnalyticsDashboard, DashboardWidget, AnalyticsReport, AnalyticsInsight, AnalyticsFunnel, AnalyticsGoal, DateRange, AnalyticsEventType } from '../domain/AnalyticsEntity';
import { ResId, JwtToken } from '@/shared/api/models/common';

/**
 * Interface for Analytics Repository
 * Defines the contract for analytics data access operations
 */
export interface IAnalyticsRepository {
  // Analytics events operations
  createEvent(event: Omit<AnalyticsEntity, 'id'>): Promise<AnalyticsEntity>;
  createEventWithId(event: AnalyticsEntity): Promise<AnalyticsEntity>;
  getEventById(eventId: string): Promise<AnalyticsEntity | null>;
  getEventsByUser(userId: string, options?: {
    limit?: number;
    offset?: number;
    eventType?: AnalyticsEventType;
    dateRange?: DateRange;
  }): Promise<AnalyticsEntity[]>;
  getEventsByType(eventType: AnalyticsEventType, options?: {
    limit?: number;
    offset?: number;
    dateRange?: DateRange;
  }): Promise<AnalyticsEntity[]>;
  getEventsByDateRange(dateRange: DateRange, options?: {
    eventType?: AnalyticsEventType;
    userId?: string;
  }): Promise<AnalyticsEntity[]>;
  
  // Analytics metrics operations
  calculateMetrics(dateRange: DateRange, filters?: {
    userId?: string;
    contentType?: string;
    eventTypes?: AnalyticsEventType[];
  }): Promise<AnalyticsMetrics>;
  
  // Real-time metrics
  getRealtimeMetrics(userId?: string): Promise<RealtimeAnalyticsMetrics>;
  
  // Performance metrics
  getPerformanceMetrics(period?: string): Promise<PerformanceAnalyticsMetrics>;
  
  // User engagement metrics
  getEngagementMetrics(userId: string, period?: string): Promise<EngagementAnalyticsMetrics>;
  
  // Conversion metrics
  getConversionMetrics(funnelId?: string, period?: string): Promise<ConversionAnalyticsMetrics>;
  
  // Traffic metrics
  getTrafficMetrics(period?: string): Promise<TrafficAnalyticsMetrics>;
  
  // Content performance metrics
  getContentMetrics(contentType?: string, period?: string): Promise<ContentAnalyticsMetrics>;
  
  // User behavior metrics
  getBehaviorMetrics(userId: string, period?: string): Promise<BehaviorAnalyticsMetrics>;
  
  // Error metrics
  getErrorMetrics(period?: string): Promise<ErrorAnalyticsMetrics>;
  
  // Dashboard operations
  createDashboard(dashboard: Omit<AnalyticsDashboard, 'id' | 'createdAt' | 'updatedAt'>): Promise<AnalyticsDashboard>;
  getDashboardById(dashboardId: string): Promise<AnalyticsDashboard | null>;
  getDashboardsByUser(userId: string): Promise<AnalyticsDashboard[]>;
  updateDashboard(dashboardId: string, updates: Partial<AnalyticsDashboard>): Promise<AnalyticsDashboard>;
  deleteDashboard(dashboardId: string): Promise<void>;
  
  // Widget operations
  addWidgetToDashboard(dashboardId: string, widget: Omit<DashboardWidget, 'id'>): Promise<DashboardWidget>;
  updateWidgetInDashboard(dashboardId: string, widgetId: string, updates: Partial<DashboardWidget>): Promise<DashboardWidget>;
  removeWidgetFromDashboard(dashboardId: string, widgetId: string): Promise<void>;
  
  // Report operations
  createReport(report: Omit<AnalyticsReport, 'id' | 'createdAt' | 'updatedAt'>): Promise<AnalyticsReport>;
  getReportById(reportId: string): Promise<AnalyticsReport | null>;
  getReportsByUser(userId: string): Promise<AnalyticsReport[]>;
  updateReport(reportId: string, updates: Partial<AnalyticsReport>): Promise<AnalyticsReport>;
  deleteReport(reportId: string): Promise<void>;
  
  // Insight operations
  createInsight(insight: Omit<AnalyticsInsight, 'id' | 'detectedAt'>): Promise<AnalyticsInsight>;
  getInsightsByUser(userId: string, options?: {
    limit?: number;
    offset?: number;
    type?: string;
  }): Promise<AnalyticsInsight[]>;
  deleteInsight(insightId: string): Promise<void>;
  
  // Funnel operations
  createFunnel(funnel: Omit<AnalyticsFunnel, 'id' | 'createdAt' | 'updatedAt'>): Promise<AnalyticsFunnel>;
  getFunnelById(funnelId: string): Promise<AnalyticsFunnel | null>;
  getFunnelsByUser(userId: string): Promise<AnalyticsFunnel[]>;
  updateFunnel(funnelId: string, updates: Partial<AnalyticsFunnel>): Promise<AnalyticsFunnel>;
  deleteFunnel(funnelId: string): Promise<void>;
  
  // Goal operations
  createGoal(goal: Omit<AnalyticsGoal, 'id' | 'createdAt' | 'updatedAt'>): Promise<AnalyticsGoal>;
  getGoalById(goalId: string): Promise<AnalyticsGoal | null>;
  getGoalsByUser(userId: string): Promise<AnalyticsGoal[]>;
  updateGoalProgress(goalId: string, progress: Partial<AnalyticsGoal['progress']>): Promise<AnalyticsGoal>;
  deleteGoal(goalId: string): Promise<void>;
  
  // Batch operations
  createBatchEvents(events: Array<Omit<AnalyticsEntity, 'id'>>): Promise<AnalyticsEntity[]>;
  
  // Data cleanup
  cleanupOldEvents(olderThan: Date): Promise<number>;
  
  // Aggregated data operations
  getAggregatedData(aggregationType: string, dateRange: DateRange, filters?: Record<string, any>): Promise<AggregatedAnalyticsData>;
  
  // Trend data operations
  getTrendData(metric: string, period: string, granularity?: string): Promise<TrendAnalyticsData>;
  
  // Comparison data operations
  getComparisonData(metric1: string, metric2: string, period: string): Promise<ComparisonAnalyticsData>;
  
  // Search analytics operations
  getSearchAnalytics(period?: string): Promise<SearchAnalyticsData>;
  
  // Media analytics operations
  getMediaAnalytics(period?: string): Promise<MediaAnalyticsData>;
  
  // Feature usage analytics
  getFeatureUsage(featureName?: string, period?: string): Promise<FeatureUsageAnalyticsData>;
  
  // A/B test analytics
  getABTestAnalytics(testId?: string, period?: string): Promise<ABTestAnalyticsData>;
  
  // Custom report operations
  getCustomReport(reportId: string): Promise<CustomReportData>;
  
  // Data export operations
  exportData(exportType: string, filters?: string): Promise<ExportAnalyticsData>;
  
  // System health and monitoring
  getSystemHealth(): Promise<SystemHealthData>;
  getProcessingQueueStatus(): Promise<ProcessingQueueStatus>;
  
  // Cache statistics
  getCacheStats(): Promise<CacheStats>;
  
  // Additional utility methods for testing
  getEvents(): Promise<AnalyticsEntity[]>;
  deleteEvent(eventId: string): Promise<void>;
  getDashboards(): Promise<AnalyticsDashboard[]>;
  getReports(): Promise<AnalyticsReport[]>;
  getInsights(): Promise<AnalyticsInsight[]>;
  getFunnels(): Promise<AnalyticsFunnel[]>;
  getGoals(): Promise<AnalyticsGoal[]>;
}

// Supporting types for enhanced analytics
export interface RealtimeAnalyticsMetrics {
  activeUsers: number;
  currentSessions: number;
  eventsPerSecond: number;
  averageResponseTime: number;
  errorRate: number;
  systemLoad: number;
  lastUpdated: Date;
}

export interface PerformanceAnalyticsMetrics {
  averageLoadTime: number;
  errorRate: number;
  throughput: number;
  resourceUsage: ResourceUsage;
  cacheHitRate: number;
  databasePerformance: DatabasePerformance;
  apiResponseTime: number;
  renderTime: number;
  lastUpdated: Date;
}

export interface EngagementAnalyticsMetrics {
  averageSessionDuration: number;
  pagesPerSession: number;
  interactionsPerSession: number;
  bounceRate: number;
  returnUserRate: number;
  contentInteractions: number;
  socialShares: number;
  timeOnPage: number;
  scrollDepth: number;
  lastUpdated: Date;
}

export interface ConversionAnalyticsMetrics {
  totalConversions: number;
  conversionRate: number;
  conversionValue: number;
  topConversionPaths: ConversionPath[];
  averageTimeToConvert: number;
  cartAbandonmentRate: number;
  checkoutCompletionRate: number;
  lastUpdated: Date;
}

export interface TrafficanalyticsMetrics {
  totalVisitors: number;
  uniqueVisitors: number;
  pageViews: number;
  sessions: number;
  bounceRate: number;
  averageSessionDuration: number;
  topPages: PageAnalyticsData[];
  topReferrers: ReferrerAnalyticsData[];
  topTrafficSources: TrafficSourceAnalyticsData[];
  deviceBreakdown: DeviceAnalyticsData[];
  browserBreakdown: BrowserAnalyticsData[];
  lastUpdated: Date;
}

export interface ContentAnalyticsMetrics {
  totalContentViews: number;
  uniqueContentViews: number;
  averageTimeOnPage: number;
  topContent: ContentAnalyticsData[];
  contentCategories: CategoryAnalyticsData[];
  mediaPerformance: MediaPerformanceData;
  lastUpdated: Date;
}

export interface BehaviorAnalyticsMetrics {
  userPaths: UserPathAnalyticsData[];
  clickHeatmap: ClickHeatmapData;
  scrollDepth: ScrollDepthAnalyticsData;
  featureAdoptionRate: FeatureAdoptionRateData;
  timeOfDayActivity: TimeOfDayAnalyticsData;
  dayOfWeekActivity: DayOfWeekAnalyticsData;
  lastUpdated: Date;
}

export interface ErrorAnalyticsMetrics {
  totalErrors: number;
  errorRate: number;
  topErrors: ErrorAnalyticsData[];
  errorCategories: ErrorCategoryAnalyticsData[];
  systemErrors: SystemErrorAnalyticsData;
  userErrors: UserErrorAnalyticsData;
  lastUpdated: Date;
}

export interface AggregatedAnalyticsData {
  aggregationType: string;
  dateRange: DateRange;
  filters: Record<string, any>;
  data: Record<string, any>;
  metadata: AggregationMetadata;
  timestamp: Date;
}

export interface TrendAnalyticsData {
  metric: string;
  period: string;
  granularity: string;
  data: TrendDataPoint[];
  metadata: TrendMetadata;
  lastUpdated: Date;
}

export interface ComparisonAnalyticsData {
  metric1: string;
  metric2: string;
  period: string;
  comparison: ComparisonResult;
  data: ComparisonDataPoint[];
  metadata: ComparisonMetadata;
  lastUpdated: Date;
}

export interface SearchAnalyticsData {
  totalSearches: number;
  uniqueSearches: number;
  topQueries: SearchQueryAnalyticsData[];
  searchSuccessRate: number;
  averageResults: number;
  noResultQueries: number;
  popularTerms: PopularTermsData[];
  lastUpdated: Date;
}

export interface MediaAnalyticsData {
  totalMediaUploads: number;
  totalStorageUsed: number;
  averageFileSize: number;
  topMediaTypes: MediaTypeAnalyticsData[];
  uploadPerformance: UploadPerformanceData;
  lastUpdated: Date;
}

export interface FeatureUsageAnalyticsData {
  totalUsage: number;
  uniqueUsers: number;
  adoptionRate: number;
  topFeatures: FeatureUsageData[];
  featureAdoptionRate: FeatureAdoptionRateData;
  lastUpdated: Date;
}

export interface ABTestAnalyticsData {
  testId: string;
  variant: string;
  participants: number;
  conversionRate: number;
  statisticalSignificance: number;
  confidence: number;
  results: ABTestResult[];
  lastUpdated: Date;
}

export interface CustomReportData {
  reportId: string;
  name: string;
  format: string;
  size: number;
  generatedAt: Date;
  downloadUrl?: string;
  expiresAt?: Date;
}

export interface ExportAnalyticsData {
  exportType: string;
  filters?: string;
  totalRecords: number;
  fileSize: number;
  generatedAt: Date;
  downloadUrl?: string;
  expiresAt?: Date;
}

export interface SystemHealthData {
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  responseTime: number;
  errorCount: number;
  lastHealthCheck: Date;
  activeConnections: number;
  queueSize: number;
  systemLoad: number;
  memoryUsage: MemoryUsageData;
  diskUsage: DiskUsageData;
  lastUpdated: Date;
}

export interface ProcessingQueueStatus {
  queueSize: number;
  processingRate: number;
  averageProcessingTime: number;
  failedJobs: number;
  successfulJobs: number;
  lastProcessedAt: Date;
  nextJobId: string;
  lastUpdated: Date;
}

export interface CacheStats {
  totalEntries: number;
  hitRate: number;
  missRate: number;
  memoryUsage: number;
  evictionCount: number;
  lastCleanup: Date;
  lastUpdated: Date;
}

export interface ResourceUsageData {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  timestamp: Date;
}

export interface DatabasePerformance {
  connectionPool: ConnectionPoolPerformance;
  queryPerformance: QueryPerformance;
  indexPerformance: IndexPerformance;
  cachePerformance: CachePerformance;
  lastUpdated: Date;
}

export interface ConnectionPoolPerformance {
  activeConnections: number;
  idleConnections: number;
  totalConnections: number;
  averageWaitTime: number;
  maxWaitTime: number;
  lastUpdated: Date;
}

export interface QueryPerformance {
  averageQueryTime: number;
  slowQueries: SlowQueryData[];
  fastQueries: FastQueryData[];
  averageRowsReturned: number;
  lastUpdated: Date;
}

export interface IndexPerformance {
  indexUsage: Record<string, IndexUsageData>;
  slowQueries: SlowQueryData[];
  indexSize: Record<string, number>;
  fragmentationLevel: Record<string, number>;
  lastUpdated: Date;
}

export interface CachePerformance {
  hitRate: number;
  missRate: number;
  averageGetTime: number;
  averageSetTime: number;
  evictionRate: number;
  memoryUsage: number;
  lastUpdated: Date;
}

export interface IndexUsageData {
  name: string;
  size: number;
  fragmentationLevel: number;
  lastAccessed: Date;
  accessCount: number;
  lastUpdated: Date;
}

export interface SlowQueryData {
  query: string;
  executionTime: number;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

export interface FastQueryData {
  query: string;
  executionTime: number;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

export interface PageAnalyticsData {
  pageId: string;
  title: string;
  url: string;
  views: number;
  uniqueViews: number;
  averageTimeOnPage: number;
  exitRate: number;
  lastVisited: Date;
}

export interface ReferrerAnalyticsData {
  source: string;
  count: number;
  users: number;
  conversions: number;
  lastAccess: Date;
}

export interface TrafficSourceAnalyticsData {
  source: string;
  visitors: number;
  pageViews: number;
  sessions: number;
  bounceRate: number;
  averageSessionDuration: number;
  lastAccess: Date;
}

export interface DeviceAnalyticsData {
  type: string;
  count: number;
  percentage: number;
  lastAccess: Date;
}

export interface BrowserAnalyticsData {
  name: string;
  version: string;
  count: number;
  percentage: number;
  lastAccess: Date;
}

export interface MediaTypeAnalyticsData {
  type: string;
  count: number;
  totalSize: number;
  averageSize: number;
  lastAccess: Date;
}

export interface UploadPerformanceData {
  averageUploadTime: number;
  successRate: number;
  failedUploads: number;
  averageFileSize: number;
  lastUploadAt: Date;
}

export interface PopularTermsData {
  term: string;
  count: number;
  frequency: number;
  lastUsed: Date;
}

export interface ConversionPath {
  path: string[];
  count: number;
  conversionRate: number;
  averageTimeToConvert: number;
  dropoffRate: number;
}

export interface ConversionResult {
  stepId: string;
  stepName: string;
  users: number;
  conversionRate: number;
  dropoffRate: number;
  averageTime: number;
}

export interface ComparisonResult {
  metric1Value: number;
  metric2Value: number;
  change: number;
  changePercentage: number;
  significance: 'statistical' | 'practical';
  confidence: number;
}

export interface AggregationMetadata {
  aggregationType: string;
  dateRange: DateRange;
  filters: Record<string, any>;
  processingTime: number;
  recordCount: number;
  lastUpdated: Date;
}

export interface TrendMetadata {
  metric: string;
  period: string;
  granularity: string;
  dataPoints: number;
  lastUpdated: Date;
}

export interface ComparisonMetadata {
  metric1: string;
  metric2: string;
  period: string;
  comparisonType: string;
  confidence: number;
  dataPoints: number;
  lastUpdated: Date;
}

export interface TrendDataPoint {
  timestamp: Date;
  value: number;
  label?: string;
}

export interface PageAnalyticsData {
  pageId: string;
  title: string;
  url: string;
  views: number;
  uniqueViews: number;
  averageTimeOnPage: number;
  exitRate: number;
  lastVisited: Date;
}

export interface ReferrerAnalyticsData {
  source: string;
  count: number;
  users: number;
  conversions: number;
  lastAccess: Date;
}

export interface TrafficSourceAnalyticsData {
  source: string;
  visitors: number;
  pageViews: number;
  sessions: number;
  bounceRate: number;
  averageSessionDuration: number;
  lastAccess: Date;
}

export interface DeviceAnalyticsData {
  type: string;
  count: number;
  percentage: number;
  lastAccess: Date;
}

export interface BrowserAnalyticsData {
  name: string;
  version: string;
  count: number;
  percentage: number;
  lastAccess: Date;
}

export interface MediaTypeAnalyticsData {
  type: string;
  count: number;
  totalSize: number;
  averageSize: number;
  lastAccess: Date;
}

export interface UploadPerformanceData {
  averageUploadTime: number;
  successRate: number;
  failedUploads: number;
  averageFileSize: number;
  lastUploadAt: Date;
}

export interface PopularTermsData {
  term: string;
  count: number;
  frequency: number;
  lastUsed: Date;
}

export interface ConversionPath {
  path: string[];
  count: number;
  conversionRate: number;
  averageTimeToConvert: number;
  dropoffRate: number;
}

export interface ConversionResult {
  stepId: string;
  stepName: string;
  users: number;
  conversionRate: number;
  dropoffRate: number;
  averageTimeToConvert: number;
}

export interface ComparisonResult {
  metric1Value: number;
  metric2Value: number;
  change: number;
  changePercentage: number;
  significance: 'statistical' | 'practical';
  confidence: number;
}

export interface AggregationMetadata {
  aggregationType: string;
  dateRange: DateRange;
  filters: Record<string, any>;
  processingTime: number;
  recordCount: number;
  lastUpdated: Date;
}

export interface TrendMetadata {
  metric: string;
  period: string;
  granularity: string;
  dataPoints: number;
  lastUpdated: Date;
}

export interface TrendDataPoint {
  timestamp: Date;
  value: number;
  label?: string;
}
