/**
 * MessageCard Component - Enterprise Chat Message Display
 * 
 * A reusable message card component extracted from chat feature implementations.
 * Follows enterprise patterns with class-based architecture and theme integration.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import React, { PureComponent } from 'react';
import { GenericWrapper } from '../../types/sharedComponentTypes';

/**
 * Message card component props interface
 */
export interface IMessageCardProps extends GenericWrapper {
  /** Message content */
  message: string;
  /** Sender information */
  sender?: {
    name: string;
    avatar?: string;
  };
  /** Message timestamp */
  timestamp?: string;
  /** Whether the message is from the current user */
  isOwn?: boolean;
  /** Message status (sent, delivered, read) */
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  /** Whether to show delete button */
  showDelete?: boolean;
  /** Delete handler */
  onDelete?: () => void;
  /** Click handler */
  onClick?: () => void;
  /** Message variant */
  variant?: 'default' | 'compact' | 'detailed';
}

/**
 * Message card component state interface
 */
interface IMessageCardState {
  isHovered: boolean;
  isDeleting: boolean;
}

/**
 * MessageCard Component
 * 
 * Enterprise-grade message card component with theme integration,
 * accessibility features, and performance optimization.
 */
export class MessageCard extends PureComponent<IMessageCardProps, IMessageCardState> {
  static defaultProps: Partial<IMessageCardProps> = {
    isOwn: false,
    status: 'sent',
    showDelete: false,
    variant: 'default',
  };

  constructor(props: IMessageCardProps) {
    super(props);
    
    this.state = {
      isHovered: false,
      isDeleting: false,
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
   * Handle delete click
   */
  private handleDeleteClick = (): void => {
    const { onDelete } = this.props;
    
    if (onDelete) {
      this.setState({ isDeleting: true });
      onDelete();
    }
  };

  /**
   * Get status indicator
   */
  private getStatusIndicator = (): string => {
    const { status } = this.props;
    
    switch (status) {
      case 'sending':
        return '⏳';
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '🔵';
      case 'failed':
        return '❌';
      default:
        return '';
    }
  };

  /**
   * Render sender information
   */
  private renderSender = (): React.ReactNode => {
    const { sender, isOwn } = this.props;

    if (!sender || isOwn) return null;

    return (
      <div className="message-sender">
        {sender.avatar && (
          <img 
            src={sender.avatar} 
            alt={sender.name}
            className="sender-avatar"
          />
        )}
        <span className="sender-name">{sender.name}</span>
      </div>
    );
  };

  /**
   * Render message content
   */
  private renderContent = (): React.ReactNode => {
    const { message } = this.props;

    return (
      <div className="message-content">
        <p className="message-text">{message}</p>
      </div>
    );
  };

  /**
   * Render message metadata
   */
  private renderMetadata = (): React.ReactNode => {
    const { timestamp, status, isOwn } = this.props;

    if (!timestamp && !status) return null;

    return (
      <div className="message-metadata">
        {timestamp && (
          <span className="message-timestamp">{timestamp}</span>
        )}
        {status && isOwn && (
          <span className="message-status">
            {this.getStatusIndicator()}
          </span>
        )}
      </div>
    );
  };

  /**
   * Render delete button
   */
  private renderDeleteButton = (): React.ReactNode => {
    const { showDelete, isOwn } = this.props;
    const { isHovered, isDeleting } = this.state;

    if (!showDelete || !isOwn || !isHovered || isDeleting) return null;

    return (
      <button 
        className="delete-button"
        onClick={this.handleDeleteClick}
        aria-label="Delete message"
      >
        🗑️
      </button>
    );
  };

  /**
   * Render main component
   */
  public override render(): React.ReactNode {
    const { className, style, onClick, isOwn } = this.props;
    const { isDeleting } = this.state;

    return (
      <div 
        className={`message-card ${isOwn ? 'own' : 'other'} ${isDeleting ? 'deleting' : ''} ${className || ''}`}
        style={style}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={onClick}
        role="article"
        aria-label="Message"
      >
        <div className="message-wrapper">
          {this.renderSender()}
          {this.renderContent()}
          {this.renderMetadata()}
        </div>
        {this.renderDeleteButton()}
      </div>
    );
  }
}

export default MessageCard;
