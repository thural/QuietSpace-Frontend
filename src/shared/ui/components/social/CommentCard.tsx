/**
 * CommentCard Component - Enterprise Comment Display
 * 
 * A reusable comment card component extracted from feed feature implementations.
 * Follows enterprise patterns with class-based architecture and theme integration.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import React, { PureComponent } from 'react';
import { GenericWrapper } from '../../types/sharedComponentTypes';

/**
 * Comment card component props interface
 */
export interface ICommentCardProps extends GenericWrapper {
  /** Comment content */
  content: string;
  /** Author information */
  author: {
    name: string;
    avatar?: string;
  };
  /** Comment timestamp */
  timestamp?: string;
  /** Whether this is a reply to another comment */
  isReply?: boolean;
  /** Reply action handler */
  onReply?: () => void;
  /** Like action handler */
  onLike?: () => void;
  /** Delete action handler */
  onDelete?: () => void;
  /** Number of likes */
  likes?: number;
  /** Whether the current user liked this comment */
  isLiked?: boolean;
  /** Show actions */
  showActions?: boolean;
  /** Comment variant */
  variant?: 'default' | 'compact' | 'detailed';
}

/**
 * Comment card component state interface
 */
interface ICommentCardState {
  isLiked: boolean;
  isReplying: boolean;
}

/**
 * CommentCard Component
 * 
 * Enterprise-grade comment card component with theme integration,
 * accessibility features, and performance optimization.
 */
export class CommentCard extends PureComponent<ICommentCardProps, ICommentCardState> {
  static defaultProps: Partial<ICommentCardProps> = {
    isReply: false,
    likes: 0,
    isLiked: false,
    showActions: true,
    variant: 'default',
  };

  constructor(props: ICommentCardProps) {
    super(props);
    
    this.state = {
      isLiked: props.isLiked || false,
      isReplying: false,
    };
  }

  /**
   * Handle like toggle
   */
  private handleLikeToggle = (): void => {
    const { onLike } = this.props;
    const { isLiked } = this.state;
    
    this.setState(prevState => ({ isLiked: !prevState.isLiked }));
    
    if (onLike) {
      onLike();
    }
  };

  /**
   * Handle reply click
   */
  private handleReplyClick = (): void => {
    const { onReply } = this.props;
    
    this.setState(prevState => ({ isReplying: !prevState.isReplying }));
    
    if (onReply) {
      onReply();
    }
  };

  /**
   * Handle delete click
   */
  private handleDeleteClick = (): void => {
    const { onDelete } = this.props;
    
    if (onDelete) {
      onDelete();
    }
  };

  /**
   * Render author avatar
   */
  private renderAvatar = (): React.ReactNode => {
    const { author } = this.props;

    if (!author.avatar) {
      return (
        <div className="comment-avatar-placeholder">
          {author.name.charAt(0).toUpperCase()}
        </div>
      );
    }

    return (
      <img 
        src={author.avatar} 
        alt={author.name}
        className="comment-avatar"
      />
    );
  };

  /**
   * Render comment header
   */
  private renderHeader = (): React.ReactNode => {
    const { author, timestamp } = this.props;

    return (
      <div className="comment-header">
        <span className="comment-author">{author.name}</span>
        {timestamp && (
          <span className="comment-timestamp">{timestamp}</span>
        )}
      </div>
    );
  };

  /**
   * Render comment content
   */
  private renderContent = (): React.ReactNode => {
    const { content } = this.props;

    return (
      <div className="comment-content">
        <p className="comment-text">{content}</p>
      </div>
    );
  };

  /**
   * Render comment actions
   */
  private renderActions = (): React.ReactNode => {
    const { showActions, likes, onDelete } = this.props;
    const { isLiked, isReplying } = this.state;

    if (!showActions) return null;

    return (
      <div className="comment-actions">
        <button 
          className={`comment-action ${isLiked ? 'liked' : ''}`}
          onClick={this.handleLikeToggle}
          aria-label={isLiked ? 'Unlike comment' : 'Like comment'}
        >
          {isLiked ? '❤️' : '🤍'} {likes || 0}
        </button>
        <button 
          className={`comment-action ${isReplying ? 'active' : ''}`}
          onClick={this.handleReplyClick}
          aria-label="Reply to comment"
        >
          💬 Reply
        </button>
        {onDelete && (
          <button 
            className="comment-action delete"
            onClick={this.handleDeleteClick}
            aria-label="Delete comment"
          >
            🗑️
          </button>
        )}
      </div>
    );
  };

  /**
   * Render main component
   */
  public override render(): React.ReactNode {
    const { className, style, isReply } = this.props;

    return (
      <div 
        className={`comment-card ${isReply ? 'reply' : ''} ${className || ''}`}
        style={style}
        role="article"
        aria-label="Comment"
      >
        {this.renderAvatar()}
        <div className="comment-wrapper">
          {this.renderHeader()}
          {this.renderContent()}
          {this.renderActions()}
        </div>
      </div>
    );
  }
}

export default CommentCard;
