/**
 * CommentCard Component Styles - Enterprise Styled-Components
 * 
 * Migrated from feed feature implementations to provide
 * consistent styling across the application.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/modules/theming';

export const CommentCardContainer = styled.div<{ theme: EnhancedTheme; isReply?: boolean }>`
  display: flex;
  margin-left: ${(props: any) => props.isReply ? 'auto' : '0'};
  font-size: ${(props: any) => props.theme.typography.fontSize.sm};
  gap: ${(props: any) => props.theme.spacing.md};

  @media (max-width: ${(props: any) => props.theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${(props: any) => props.theme.spacing.sm};
  }

  &.reply {
    margin-left: ${(props: any) => props.theme.spacing.lg};
  }

  .comment-avatar {
    width: ${(props: any) => props.theme.spacing.xl};
    height: ${(props: any) => props.theme.spacing.xl};
    border-radius: ${(props: any) => props.theme.radius.full};
    background-color: ${(props: any) => props.theme.colors.brand[500]};
    color: ${(props: any) => props.theme.colors.text.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${(props: any) => props.theme.typography.fontSize.lg};
    font-weight: ${(props: any) => props.theme.typography.fontWeight.bold};
    flex-shrink: 0;
    object-fit: cover;
  }

  .comment-avatar-placeholder {
    width: ${(props: any) => props.theme.spacing.xl};
    height: ${(props: any) => props.theme.spacing.xl};
    border-radius: ${(props: any) => props.theme.radius.full};
    background-color: ${(props: any) => props.theme.colors.brand[500]};
    color: ${(props: any) => props.theme.colors.text.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${(props: any) => props.theme.typography.fontSize.lg};
    font-weight: ${(props: any) => props.theme.typography.fontWeight.bold};
    flex-shrink: 0;
  }

  .comment-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: ${(props: any) => props.theme.spacing.xs};
  }

  .comment-header {
    display: flex;
    align-items: center;
    gap: ${(props: any) => props.theme.spacing.sm};
    margin-bottom: ${(props: any) => props.theme.spacing.xs};

    .comment-author {
      font-size: ${(props: any) => props.theme.typography.fontSize.sm};
      font-weight: ${(props: any) => props.theme.typography.fontWeight.bold};
      color: ${(props: any) => props.theme.colors.text.primary};
    }

    .comment-timestamp {
      font-size: ${(props: any) => props.theme.typography.fontSize.sm};
      color: ${(props: any) => props.theme.colors.text.secondary};
      margin-left: ${(props: any) => props.theme.spacing.xs};
    }
  }

  .comment-content {
    .comment-text {
      font-size: ${(props: any) => props.theme.typography.fontSize.sm};
      color: ${(props: any) => props.theme.colors.text.primary};
      line-height: ${(props: any) => props.theme.typography.lineHeight.normal};
      margin: 0;
      word-wrap: break-word;

      @media (max-width: ${(props: any) => props.theme.breakpoints.sm}) {
        font-size: ${(props: any) => props.theme.typography.fontSize.sm};
      }
    }
  }

  .comment-actions {
    display: flex;
    align-items: center;
    gap: ${(props: any) => props.theme.spacing.sm};
    margin-top: ${(props: any) => props.theme.spacing.sm};

    @media (max-width: ${(props: any) => props.theme.breakpoints.sm}) {
      justify-content: space-between;
    }

    .comment-action {
      background: none;
      border: none;
      cursor: pointer;
      color: ${(props: any) => props.theme.colors.text.secondary};
      font-size: ${(props: any) => props.theme.typography.fontSize.sm};
      padding: ${(props: any) => props.theme.spacing.xs};
      border-radius: ${(props: any) => props.theme.radius.sm};
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: ${(props: any) => props.theme.spacing.xs};

      &:hover {
        color: ${(props: any) => props.theme.colors.brand[500]};
        background-color: ${(props: any) => props.theme.colors.background.secondary};
      }

      &.liked {
        color: #e74c3c;
      }

      &.active {
        color: ${(props: any) => props.theme.colors.brand[500]};
      }

      &.delete {
        &:hover {
          color: ${(props: any) => props.theme.colors.danger};
        }
      }

      &:active {
        transform: scale(0.95);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
`;

export const CommentReplyCard = styled.div<{ theme: EnhancedTheme }>`
  background-color: ${(props: any) => props.theme.colors.background.secondary};
  border-radius: ${(props: any) => props.theme.radius.md};
  padding: ${(props: any) => props.theme.spacing.md};
  margin-top: ${(props: any) => props.theme.spacing.sm};
  border: 1px solid ${(props: any) => props.theme.colors.border.light};

  @media (max-width: ${(props: any) => props.theme.breakpoints.sm}) {
    margin-left: ${(props: any) => props.theme.spacing.md};
  }
`;

// Legacy export for backward compatibility
export const CommentCardStyles = {
  container: CommentCardContainer,
  replyCard: CommentReplyCard,
};

export default CommentCardStyles;
