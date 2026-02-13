/**
 * PostCard Component - Enterprise Social Media Post Display
 * 
 * A reusable post card component extracted from feature-specific implementations.
 * Follows enterprise patterns with class-based architecture and theme integration.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import React, { PureComponent } from 'react';
import { GenericWrapper } from '../../types/sharedComponentTypes';

/**
 * Post card component props interface
 */
export interface IPostCardProps extends GenericWrapper {
  /** Post title */
  title?: string;
  /** Post content/body text */
  content?: string;
  /** Author information */
  author?: {
    name: string;
    avatar?: string;
  };
  /** Post timestamp */
  timestamp?: string;
  /** Post metadata (likes, comments, etc.) */
  metadata?: {
    likes?: number;
    comments?: number;
    shares?: number;
  };
  /** Whether to show the badge */
  showBadge?: boolean;
  /** Badge content */
  badgeContent?: string;
  /** Action buttons */
  actions?: React.ReactNode;
  /** Variant styling */
  variant?: 'default' | 'compact' | 'detailed';
  /** Click handler */
  onClick?: () => void;
}

/**
 * Post card component state interface
 */
interface IPostCardState {
  isHovered: boolean;
  isLiked: boolean;
}

/**
 * PostCard Component
 * 
 * Enterprise-grade post card component with theme integration,
 * accessibility features, and performance optimization.
 */
export class PostCard extends PureComponent<IPostCardProps, IPostCardState> {
  static defaultProps: Partial<IPostCardProps> = {
    variant: 'default',
    showBadge: false,
  };

  constructor(props: IPostCardProps) {
    super(props);
    
    this.state = {
      isHovered: false,
      isLiked: false,
    };
  }

  /**
   * Handle mouse enter event
   */
  private handleMouseEnter = (): void => {
    this.setState({ isHovered: true });
  };

  /**
   * Handle mouse leave event
   */
  private handleMouseLeave = (): void => {
    this.setState({ isHovered: false });
  };

  /**
   * Handle like toggle
   */
  private handleLikeToggle = (): void => {
    this.setState(prevState => ({ isLiked: !prevState.isLiked }));
  };

  /**
   * Render badge component
   */
  private renderBadge = (): React.ReactNode => {
    const { showBadge, badgeContent } = this.props;

    if (!showBadge || !badgeContent) return null;

    return (
      <div className="post-card-badge">
        <div className="badge-content">{badgeContent}</div>
      </div>
    );
  };

  /**
   * Render post header
   */
  private renderHeader = (): React.ReactNode => {
    const { author, timestamp } = this.props;

    if (!author && !timestamp) return null;

    return (
      <div className="post-header">
        {author && (
          <div className="author-info">
            {author.avatar && (
              <img 
                src={author.avatar} 
                alt={author.name}
                className="author-avatar"
              />
            )}
            <span className="author-name">{author.name}</span>
          </div>
        )}
        {timestamp && (
          <span className="post-timestamp">{timestamp}</span>
        )}
      </div>
    );
  };

  /**
   * Render post title
   */
  private renderTitle = (): React.ReactNode => {
    const { title } = this.props;

    if (!title) return null;

    return <h3 className="post-title">{title}</h3>;
  };

  /**
   * Render post content
   */
  private renderContent = (): React.ReactNode => {
    const { content } = this.props;

    if (!content) return null;

    return (
      <div className="post-content">
        <div className="post-body">
          <p>{content}</p>
        </div>
      </div>
    );
  };

  /**
   * Render post metadata
   */
  private renderMetadata = (): React.ReactNode => {
    const { metadata } = this.props;

    if (!metadata) return null;

    const { likes = 0, comments = 0, shares = 0 } = metadata;

    return (
      <div className="post-meta">
        <span className="meta-item">
          {likes} {likes === 1 ? 'like' : 'likes'}
        </span>
        <span className="meta-item">
          {comments} {comments === 1 ? 'comment' : 'comments'}
        </span>
        <span className="meta-item">
          {shares} {shares === 1 ? 'share' : 'shares'}
        </span>
      </div>
    );
  };

  /**
   * Render post footer with actions
   */
  private renderFooter = (): React.ReactNode => {
    const { actions, metadata } = this.props;
    const { isLiked } = this.state;

    return (
      <div className="post-footer">
        <div className="post-actions">
          {actions || (
            <>
              <button 
                className={`action-button ${isLiked ? 'liked' : ''}`}
                onClick={this.handleLikeToggle}
                aria-label={isLiked ? 'Unlike post' : 'Like post'}
              >
                {isLiked ? '❤️' : '🤍'} Like
              </button>
              <button className="action-button">
                💬 Comment
              </button>
              <button className="action-button">
                🔄 Share
              </button>
            </>
          )}
        </div>
        {metadata && this.renderMetadata()}
      </div>
    );
  };

  /**
   * Render main component
   */
  public override render(): React.ReactNode {
    const { className, style, onClick } = this.props;
    const { isHovered } = this.state;

    return (
      <div 
        className={`post-card ${isHovered ? 'hovered' : ''} ${className || ''}`}
        style={style}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={onClick}
        role="article"
        aria-label="Post"
      >
        {this.renderBadge()}
        {this.renderHeader()}
        {this.renderTitle()}
        {this.renderContent()}
        {this.renderFooter()}
      </div>
    );
  }
}

export default PostCard;
