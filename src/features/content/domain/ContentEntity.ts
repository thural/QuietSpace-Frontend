export interface ContentEntity {
  id: string;
  authorId: string;
  title: string;
  content: string;
  contentType: 'text' | 'article' | 'post' | 'comment' | 'page';
  status: 'draft' | 'published' | 'archived' | 'moderated' | 'deleted';
  visibility: 'public' | 'private' | 'unlisted';
  tags: string[];
  categories: string[];
  metadata: ContentMetadata;
  seo: SEOData;
  moderation: ModerationData;
  analytics: ContentAnalytics;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface ContentMetadata {
  wordCount: number;
  readingTime: number;
  language: string;
  featuredImage?: string;
  images: MediaFile[];
  videos: MediaFile[];
  documents: MediaFile[];
  links: ContentLink[];
  customFields: Record<string, any>;
}

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  metadata: MediaMetadata;
  uploadedAt: Date;
  processedAt?: Date;
}

export interface MediaMetadata {
  width?: number;
  height?: number;
  duration?: number;
  format?: string;
  quality?: string;
  alt?: string;
  caption?: string;
  tags: string[];
}

export interface ContentLink {
  id: string;
  url: string;
  title: string;
  description?: string;
  thumbnail?: string;
  domain: string;
  verified: boolean;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  metaRobots: string;
  structuredData?: Record<string, any>;
}

export interface ModerationData {
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  flags: ModerationFlag[];
  autoModeration: boolean;
  moderatedBy?: string;
  moderatedAt?: Date;
  moderationNotes?: string;
  appealStatus?: 'none' | 'pending' | 'approved' | 'rejected';
}

export interface ModerationFlag {
  type: 'spam' | 'hate' | 'violence' | 'adult' | 'copyright' | 'misinformation' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  description: string;
  flaggedBy: 'ai' | 'user' | 'moderator';
  flaggedAt: Date;
}

export interface ContentAnalytics {
  views: number;
  uniqueViews: number;
  likes: number;
  shares: number;
  comments: number;
  averageReadTime: number;
  bounceRate: number;
  engagementScore: number;
  conversionRate?: number;
  lastUpdated: Date;
}

export interface ContentVersion {
  id: string;
  contentId: string;
  version: number;
  title: string;
  content: string;
  changes: ContentChange[];
  authorId: string;
  createdAt: Date;
  publishedAt?: Date;
}

export interface ContentChange {
  type: 'create' | 'update' | 'delete' | 'publish' | 'archive';
  field: string;
  oldValue?: string;
  newValue?: string;
  timestamp: Date;
  authorId: string;
}

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  contentType: ContentEntity['contentType'];
  template: string;
  variables: TemplateVariable[];
  isDefault: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect';
  required: boolean;
  defaultValue?: any;
  options?: string[];
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value: any;
  message: string;
}
