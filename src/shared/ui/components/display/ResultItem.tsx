/**
 * Result Item Component
 * 
 * A reusable result display component for search results, lists, and
 * content discovery with flexible rendering options.
 */

import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * Result Item Type
 */
export type ResultItemType = 'user' | 'post' | 'content' | 'page' | 'file' | 'generic';

/**
 * Result Item Props
 */
export interface IResultItemProps extends IBaseComponentProps {
  id: string;
  type: ResultItemType;
  title: string;
  description?: string;
  content?: string;
  author?: {
    name: string;
    username?: string;
    avatar?: string;
  };
  metadata?: {
    createdAt?: Date;
    updatedAt?: Date;
    category?: string;
    tags?: string[];
    size?: string;
    views?: number;
    likes?: number;
    comments?: number;
    [key: string]: any;
  };
  thumbnail?: string;
  url?: string;
  onClick?: (item: IResultItemProps) => void;
  variant?: 'default' | 'compact' | 'detailed' | 'card';
  showThumbnail?: boolean;
  showAuthor?: boolean;
  showMetadata?: boolean;
  className?: string;
}

/**
 * Result Item State
 */
export interface IResultItemState extends IBaseComponentState {
  isHovered: boolean;
  imageError: boolean;
}

/**
 * Result Item Component
 * 
 * Provides result display with:
 * - Multiple result types (user, post, content, page, file)
 * - Flexible variants (default, compact, detailed, card)
 * - Author information and avatars
 * - Metadata and timestamps
 * - Thumbnail support with fallback
 * - Click interactions and hover effects
 * - Tag and category display
 * 
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class ResultItem extends BaseClassComponent<IResultItemProps, IResultItemState> {
  
  protected override getInitialState(): Partial<IResultItemState> {
    return {
      isHovered: false,
      imageError: false
    };
  }

  /**
   * Handle mouse enter
   */
  private handleMouseEnter = (): void => {
    this.safeSetState({ isHovered: true });
  };

  /**
   * Handle mouse leave
   */
  private handleMouseLeave = (): void => {
    this.safeSetState({ isHovered: false });
  };

  /**
   * Handle click
   */
  private handleClick = (): void => {
    const { onClick } = this.props;

    if (onClick) {
      onClick(this.props);
    }
  };

  /**
   * Handle image error
   */
  private handleImageError = (): void => {
    this.safeSetState({ imageError: true });
  };

  /**
   * Get type icon
   */
  private getTypeIcon = (type: ResultItemType): string => {
    const icons = {
      user: '👤',
      post: '📝',
      content: '📄',
      page: '📄',
      file: '📎',
      generic: '🔍'
    };

    return icons[type] || icons.generic;
  };

  /**
   * Get container styles
   */
  private getContainerStyles = (): string => {
    const { variant = 'default', onClick, className = '' } = this.props;
    const { isHovered } = this.state;

    const baseStyles = 'border rounded-lg transition-all duration-200';
    const hoverStyles = isHovered ? 'shadow-md' : 'shadow-sm';
    const interactionStyles = onClick ? 'cursor-pointer' : '';
    
    const variantStyles = {
      default: 'p-4 bg-white hover:bg-gray-50',
      compact: 'p-3 bg-white hover:bg-gray-50',
      detailed: 'p-6 bg-white hover:bg-gray-50',
      card: 'p-4 bg-white hover:shadow-lg'
    };

    return `${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${interactionStyles} ${className}`;
  };

  /**
   * Format timestamp
   */
  private formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
  };

  /**
   * Render thumbnail
   */
  private renderThumbnail = (): React.ReactNode => {
    const { thumbnail, type, showThumbnail = true } = this.props;
    const { imageError } = this.state;

    if (!showThumbnail || !thumbnail || imageError) {
      return (
        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-xl text-gray-400">
            {this.getTypeIcon(type)}
          </span>
        </div>
      );
    }

    return (
      <img
        src={thumbnail}
        alt=""
        onError={this.handleImageError}
        className="w-12 h-12 object-cover rounded-lg"
      />
    );
  };

  /**
   * Render author information
   */
  private renderAuthor = (): React.ReactNode => {
    const { author, showAuthor = true } = this.props;

    if (!showAuthor || !author) {
      return null;
    }

    return (
      <div className="flex items-center space-x-2">
        {author.avatar ? (
          <img
            src={author.avatar}
            alt={author.name}
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xs text-gray-600">
              {author.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <div className="text-sm font-medium text-gray-900">{author.name}</div>
          {author.username && (
            <div className="text-xs text-gray-500">@{author.username}</div>
          )}
        </div>
      </div>
    );
  };

  /**
   * Render metadata
   */
  private renderMetadata = (): React.ReactNode => {
    const { metadata, showMetadata = true } = this.props;

    if (!showMetadata || !metadata) {
      return null;
    }

    return (
      <div className="flex items-center space-x-4 text-xs text-gray-500">
        {metadata.createdAt && (
          <span>{this.formatTimestamp(metadata.createdAt)}</span>
        )}
        {metadata.category && (
          <span className="px-2 py-1 bg-gray-100 rounded">
            {metadata.category}
          </span>
        )}
        {metadata.views !== undefined && (
          <span>👁️ {metadata.views}</span>
        )}
        {metadata.likes !== undefined && (
          <span>❤️ {metadata.likes}</span>
        )}
        {metadata.comments !== undefined && (
          <span>💬 {metadata.comments}</span>
        )}
        {metadata.size && (
          <span>📎 {metadata.size}</span>
        )}
      </div>
    );
  };

  /**
   * Render tags
   */
  private renderTags = (): React.ReactNode => {
    const { metadata } = this.props;
    const tags = metadata?.tags;

    if (!tags || tags.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
          >
            {tag}
          </span>
        ))}
        {tags.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
            +{tags.length - 3}
          </span>
        )}
      </div>
    );
  };

  /**
   * Render default variant
   */
  private renderDefault = (): React.ReactNode => {
    const { type, title, description, content } = this.props;

    return (
      <div className="flex items-start space-x-3">
        {this.renderThumbnail()}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">
              {this.getTypeIcon(type)}
            </span>
            <h3 className="font-medium text-gray-900 truncate">{title}</h3>
          </div>
          
          {description && (
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {description}
            </p>
          )}
          
          {content && !description && (
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {content.substring(0, 150)}...
            </p>
          )}
          
          {this.renderAuthor()}
          {this.renderMetadata()}
        </div>
      </div>
    );
  };

  /**
   * Render compact variant
   */
  private renderCompact = (): React.ReactNode => {
    const { type, title, metadata } = this.props;

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <span className="text-sm text-gray-400">
            {this.getTypeIcon(type)}
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">{title}</div>
            {metadata?.createdAt && (
              <div className="text-xs text-gray-500">
                {this.formatTimestamp(metadata.createdAt)}
              </div>
            )}
          </div>
        </div>
        
        {metadata?.views !== undefined && (
          <span className="text-xs text-gray-500">
            👁️ {metadata.views}
          </span>
        )}
      </div>
    );
  };

  /**
   * Render detailed variant
   */
  private renderDetailed = (): React.ReactNode => {
    const { type, title, description, content } = this.props;

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start space-x-4">
          <div className="text-2xl text-gray-400">
            {this.getTypeIcon(type)}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {description && (
              <p className="text-gray-600 mt-2">{description}</p>
            )}
            {content && !description && (
              <p className="text-gray-600 mt-2">
                {content.substring(0, 200)}...
              </p>
            )}
          </div>
        </div>

        {/* Author and metadata */}
        <div className="space-y-3">
          {this.renderAuthor()}
          {this.renderMetadata()}
        </div>

        {/* Tags */}
        {this.renderTags()}
      </div>
    );
  };

  /**
   * Render card variant
   */
  private renderCard = (): React.ReactNode => {
    const { type, title, description, thumbnail } = this.props;

    return (
      <div className="space-y-3">
        {/* Thumbnail or icon */}
        {thumbnail && !this.state.imageError ? (
          <img
            src={thumbnail}
            alt=""
            onError={this.handleImageError}
            className="w-full h-32 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-3xl text-gray-400">
              {this.getTypeIcon(type)}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900 truncate">{title}</h3>
          {description && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {description}
            </p>
          )}
          {this.renderMetadata()}
        </div>
      </div>
    );
  };

  protected override renderContent(): React.ReactNode {
    const { variant = 'default' } = this.props;

    return (
      <div
        className={this.getContainerStyles()}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && this.handleClick()}
      >
        {variant === 'default' && this.renderDefault()}
        {variant === 'compact' && this.renderCompact()}
        {variant === 'detailed' && this.renderDetailed()}
        {variant === 'card' && this.renderCard()}
      </div>
    );
  }
}

export default ResultItem;
