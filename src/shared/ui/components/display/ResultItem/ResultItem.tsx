/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import { IResultItemProps, IResultItemState } from './interfaces';
import {
  getTypeIcon,
  createResultItemStyles,
  createThumbnailStyles,
  createContentStyles,
  createTitleStyles,
  createDescriptionStyles,
  createAuthorStyles,
  createMetadataStyles
} from './styles';

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
      isFocused: false
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
   * Handle focus
   */
  private handleFocus = (): void => {
    this.safeSetState({ isFocused: true });
  };

  /**
   * Handle blur
   */
  private handleBlur = (): void => {
    this.safeSetState({ isFocused: false });
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
   * Handle key press
   */
  private handleKeyPress = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.handleClick();
    }
  };

  /**
   * Format date
   */
  private formatDate = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  /**
   * Render thumbnail
   */
  private renderThumbnail = (): React.ReactNode => {
    const { thumbnail, type, variant = 'default', showThumbnail = true } = this.props;

    if (!showThumbnail) return null;

    const thumbnailStyles = createThumbnailStyles(variant, showThumbnail);
    const typeIcon = getTypeIcon(type);

    if (thumbnail) {
      return (
        <img
          css={thumbnailStyles}
          src={thumbnail}
          alt={`${this.props.title} thumbnail`}
          onError={(e) => {
            // Fallback to type icon on image error
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            if (target.nextElementSibling) {
              (target.nextElementSibling as HTMLElement).style.display = 'flex';
            }
          }}
        />
      );
    }

    return (
      <div css={thumbnailStyles}>
        {typeIcon}
      </div>
    );
  };

  /**
   * Render author
   */
  private renderAuthor = (): React.ReactNode => {
    const { author, variant = 'default', showAuthor = true } = this.props;

    if (!showAuthor || !author) return null;

    const authorStyles = createAuthorStyles(variant);

    return (
      <div css={authorStyles}>
        {author.avatar && (
          <img
            className="author-avatar"
            src={author.avatar}
            alt={author.name}
          />
        )}
        <span className="author-name">{author.name}</span>
        {author.username && (
          <>
            <span className="metadata-separator">@</span>
            <span className="author-username">{author.username}</span>
          </>
        )}
      </div>
    );
  };

  /**
   * Render metadata
   */
  private renderMetadata = (): React.ReactNode => {
    const { metadata, variant = 'default', showMetadata = true } = this.props;

    if (!showMetadata || !metadata) return null;

    const metadataStyles = createMetadataStyles(variant);
    const items: string[] = [];

    // Add date
    if (metadata.createdAt) {
      items.push(this.formatDate(metadata.createdAt));
    }

    // Add category
    if (metadata.category) {
      items.push(metadata.category);
    }

    // Add stats
    if (metadata.views !== undefined) {
      items.push(`${metadata.views} views`);
    }

    if (metadata.likes !== undefined) {
      items.push(`${metadata.likes} likes`);
    }

    if (metadata.comments !== undefined) {
      items.push(`${metadata.comments} comments`);
    }

    // Add size for files
    if (metadata.size) {
      items.push(metadata.size);
    }

    if (items.length === 0) return null;

    return (
      <div css={metadataStyles}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <span className="metadata-item">{item}</span>
            {index < items.length - 1 && (
              <span className="metadata-separator">•</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  /**
   * Render tags
   */
  private renderTags = (): React.ReactNode => {
    const { metadata, variant = 'default' } = this.props;

    if (!metadata?.tags || metadata.tags.length === 0) return null;

    const isCompact = variant === 'compact';
    const maxTags = isCompact ? 2 : 5;
    const tags = metadata.tags.slice(0, maxTags);
    const remaining = metadata.tags.length - maxTags;

    return (
      <div css={css`
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
          margin-top: 0.5rem;
        `}>
        {tags.map((tag, index) => (
          <span
            key={index}
            css={css`
                display: inline-block;
                padding: 0.125rem 0.375rem;
                background-color: #f3f4f6;
                color: #374151;
                font-size: ${variant === 'compact' ? '0.625rem' : '0.75rem'};
                border-radius: 0.25rem;
                font-weight: 500;
              `}
          >
            {tag}
          </span>
        ))}
        {remaining > 0 && (
          <span
            css={css`
                display: inline-block;
                padding: 0.125rem 0.375rem;
                background-color: #e5e7eb;
                color: #6b7280;
                font-size: ${variant === 'compact' ? '0.625rem' : '0.75rem'};
                border-radius: 0.25rem;
                font-weight: 500;
              `}
          >
            +{remaining}
          </span>
        )}
      </div>
    );
  };

  protected override renderContent(): React.ReactNode {
    const {
      title,
      description,
      content,
      variant = 'default',
      showThumbnail = true,
      className = '',
      testId
    } = this.props;
    const { isHovered } = this.state;

    const containerStyles = createResultItemStyles(variant, isHovered, className);
    const contentStyles = createContentStyles(variant, showThumbnail);
    const titleStyles = createTitleStyles(variant);
    const descriptionStyles = createDescriptionStyles(variant);

    return (
      <div
        css={containerStyles}
        className={className}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onClick={this.handleClick}
        onKeyPress={this.handleKeyPress}
        role="button"
        tabIndex={0}
        data-testid={testId}
      >
        {this.renderThumbnail()}

        <div css={contentStyles}>
          <h3 css={titleStyles}>{title}</h3>

          {description && (
            <p css={descriptionStyles}>{description}</p>
          )}

          {content && variant === 'detailed' && (
            <div css={css`
                font-size: 0.875rem;
                color: #4b5563;
                line-height: 1.6;
                margin-top: 0.5rem;
                
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
              `}>
              {content}
            </div>
          )}

          {this.renderAuthor()}
          {this.renderMetadata()}
          {this.renderTags()}
        </div>
      </div>
    );
  }
}

export default ResultItem;
