/**
 * NotificationItem Component Styles
 */

import { css } from '@emotion/react';

/**
 * Base notification item container styles
 */
export const notificationItemContainerStyles = css`
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background-color: #ffffff;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #f8f9fa;
    border-color: #d1d5db;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &.unread {
    background-color: #f0f7ff;
    border-color: #3b82f6;
    border-left: 4px solid #3b82f6;
  }

  &.compact {
    padding: 0.75rem;
    font-size: 0.875rem;
  }

  &.detailed {
    padding: 1.5rem;
    border-radius: 12px;
  }

  .notification-icon {
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    margin-right: 1rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 600;

    &.info { background-color: #dbeafe; color: #1e40af; }
    &.success { background-color: #d1fae5; color: #065f46; }
    &.warning { background-color: #fed7aa; color: #92400e; }
    &.error { background-color: #fecaca; color: #991b1b; }
    &.follow { background-color: #e9d5ff; color: #6b21a8; }
    &.mention { background-color: #fef3c7; color: #92400e; }
    &.comment { background-color: #e0e7ff; color: #3730a3; }
    &.like { background-color: #fce7f3; color: #9f1239; }
  }

  .notification-content {
    flex: 1;
    min-width: 0;
  }

  .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.25rem;
  }

  .notification-title {
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .notification-timestamp {
    font-size: 0.75rem;
    color: #6b7280;
    white-space: nowrap;
    margin-left: 0.5rem;
  }

  .notification-message {
    color: #4b5563;
    font-size: 0.875rem;
    line-height: 1.4;
    margin-bottom: 0.5rem;
  }

  .notification-author {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;

    .author-avatar {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      margin-right: 0.5rem;
    }

    .author-name {
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }
  }

  .notification-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.75rem;

    .action-button {
      padding: 0.25rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      background-color: #ffffff;
      color: #374151;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease-in-out;

      &:hover {
        background-color: #f9fafb;
        border-color: #9ca3af;
      }

      &.primary {
        background-color: #3b82f6;
        color: #ffffff;
        border-color: #3b82f6;

        &:hover {
          background-color: #2563eb;
        }
      }

      &.danger {
        background-color: #ef4444;
        color: #ffffff;
        border-color: #ef4444;

        &:hover {
          background-color: #dc2626;
        }
      }
    }
  }

  .notification-metadata {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid #f3f4f6;
    font-size: 0.75rem;
    color: #6b7280;
  }
`;
