/**
 * CommentCard Component Styles - Enterprise Styled-Components
 * 
 * Migrated from feed feature implementations to provide
 * consistent styling across the application.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/modules/theming';
import { getSpacing, getColor, getTypography, getRadius, getTransition, getBreakpoint } from '../utils';

export const CommentCardContainer = styled.div<{ theme: EnhancedTheme; isReply?: boolean }>`
  display: flex;
  margin-left: ${(props: any) => props.isReply ? 'auto' : '0'};
  font-size: ${(props: any) => getTypography(props.theme, 'fontSize.sm')};
  gap: ${(props: any) => getSpacing(props.theme, 'md')};

  @media (max-width: ${(props: any) => getBreakpoint(props.theme, 'sm')}) {
    flex-direction: column;
    gap: ${(props: any) => getSpacing(props.theme, 'sm')};
  }

  &.reply {
    margin-left: ${(props: any) => getSpacing(props.theme, 'lg')};
  }

  .comment-avatar {
    width: ${(props: any) => getSpacing(props.theme, 'xl')};
    height: ${(props: any) => getSpacing(props.theme, 'xl')};
    border-radius: ${(props: any) => getRadius(props.theme, 'full')};
    background-color: ${(props: any) => getColor(props.theme, 'brand.500')};
    color: ${(props: any) => getColor(props.theme, 'text.primary')};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${(props: any) => getTypography(props.theme, 'fontSize.lg')};
    font-weight: ${(props: any) => getTypography(props.theme, 'fontWeight.bold')};
    flex-shrink: 0;
    object-fit: cover;
  }

  .comment-avatar-placeholder {
    width: ${(props: any) => getSpacing(props.theme, 'xl')};
    height: ${(props: any) => getSpacing(props.theme, 'xl')};
    border-radius: ${(props: any) => getRadius(props.theme, 'full')};
    background-color: ${(props: any) => getColor(props.theme, 'brand.500')};
    color: ${(props: any) => getColor(props.theme, 'text.primary')};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${(props: any) => getTypography(props.theme, 'fontSize.lg')};
    font-weight: ${(props: any) => getTypography(props.theme, 'fontWeight.bold')};
    flex-shrink: 0;
  }

  .comment-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: ${(props: any) => getSpacing(props.theme, 'xs')};
  }

  .comment-header {
    display: flex;
    align-items: center;
    gap: ${(props: any) => getSpacing(props.theme, 'sm')};
    margin-bottom: ${(props: any) => getSpacing(props.theme, 'xs')};

    .comment-author {
      font-size: ${(props: any) => getTypography(props.theme, 'fontSize.sm')};
      font-weight: ${(props: any) => getTypography(props.theme, 'fontWeight.bold')};
      color: ${(props: any) => getColor(props.theme, 'text.primary')};
    }

    .comment-timestamp {
      font-size: ${(props: any) => getTypography(props.theme, 'fontSize.sm')};
      color: ${(props: any) => getColor(props.theme, 'text.secondary')};
      margin-left: ${(props: any) => getSpacing(props.theme, 'xs')};
    }
  }

  .comment-content {
    .comment-text {
      font-size: ${(props: any) => getTypography(props.theme, 'fontSize.sm')};
      color: ${(props: any) => getColor(props.theme, 'text.primary')};
      line-height: ${(props: any) => getTypography(props.theme, 'lineHeight.normal')};
      margin: 0;
      word-wrap: break-word;

      @media (max-width: ${(props: any) => getBreakpoint(props.theme, 'sm')}) {
        font-size: ${(props: any) => getTypography(props.theme, 'fontSize.sm')};
      }
    }
  }

  .comment-actions {
    display: flex;
    align-items: center;
    gap: ${(props: any) => getSpacing(props.theme, 'sm')};
    margin-top: ${(props: any) => getSpacing(props.theme, 'sm')};

    @media (max-width: ${(props: any) => getBreakpoint(props.theme, 'sm')}) {
      justify-content: space-between;
    }

    .comment-action {
      background: none;
      border: none;
      cursor: pointer;
      color: ${(props: any) => getColor(props.theme, 'text.secondary')};
      font-size: ${(props: any) => getTypography(props.theme, 'fontSize.sm')};
      padding: ${(props: any) => getSpacing(props.theme, 'xs')};
      border-radius: ${(props: any) => getRadius(props.theme, 'sm')};
      transition: ${(props: any) => getTransition(props.theme, 'all', 'fast', 'ease')};
      display: flex;
      align-items: center;
      gap: ${(props: any) => getSpacing(props.theme, 'xs')};

      &:hover {
        color: ${(props: any) => getColor(props.theme, 'brand.500')};
        background-color: ${(props: any) => getColor(props.theme, 'background.secondary')};
      }

      &.liked {
        color: ${(props: any) => getColor(props.theme, 'semantic.error')};
      }

      &.active {
        color: ${(props: any) => getColor(props.theme, 'brand.500')};
      }

      &.delete {
        &:hover {
          color: ${(props: any) => getColor(props.theme, 'danger')};
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
