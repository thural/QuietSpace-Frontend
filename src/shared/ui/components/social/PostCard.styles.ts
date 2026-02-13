/**
 * PostCard Component Styles - Enterprise Styled-Components
 * 
 * Migrated from feature-specific implementations to provide
 * consistent styling across the application.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/modules/theming';

export const PostCardContainer = styled.div<{ theme: EnhancedTheme }>`
  padding: 0;
  position: relative;
  font-size: ${(props: any) => props.theme.typography.fontSize.base};
  margin: ${(props: any) => `${props.theme.spacing.md} 0`};
  border-radius: ${(props: any) => props.theme.radius.md};
  background-color: ${(props: any) => props.theme.colors.background.primary};
  border: 1px solid ${(props: any) => props.theme.colors.border.light};
  transition: all 0.2s ease;
  cursor: ${(props: any) => props.onClick ? 'pointer' : 'default'};

  &:hover {
    border-color: ${(props: any) => props.theme.colors.border.base};
    box-shadow: ${(props: any) => props.theme.shadows.sm};
  }

  &.hovered {
    transform: translateY(-2px);
  }
`;

export const PostCardBadge = styled.div<{ theme: EnhancedTheme }>`
  position: absolute;
  left: ${(props: any) => props.theme.spacing.sm};
  bottom: ${(props: any) => props.theme.spacing.lg};
  min-width: ${(props: any) => props.theme.spacing.sm};
  height: ${(props: any) => props.theme.spacing.sm};
  border-radius: ${(props: any) => props.theme.radius.full};
  background-color: ${(props: any) => props.theme.colors.brand[500]};
  color: ${(props: any) => props.theme.colors.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props: any) => props.theme.typography.fontSize.sm};
  font-weight: ${(props: any) => props.theme.typography.fontWeight.bold};
  box-shadow: ${(props: any) => props.theme.shadows.sm};
  z-index: ${(props: any) => props.theme.zIndex.above};

  .badge-content {
    background-color: ${(props: any) => props.theme.colors.border.light};
    color: ${(props: any) => props.theme.colors.text.primary};
    border-radius: ${(props: any) => props.theme.radius.sm};
    padding: ${(props: any) => `${props.theme.spacing.xs} ${props.theme.spacing.sm}`};
    font-size: ${(props: any) => props.theme.typography.fontSize.sm};
    font-weight: ${(props: any) => props.theme.typography.fontWeight.normal};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: ${(props: any) => props.theme.spacing.xl};
  }
`;

export const PostCardHeader = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(props: any) => props.theme.spacing.sm};
  padding: 0 ${(props: any) => props.theme.spacing.md};

  .author-info {
    display: flex;
    align-items: center;
    gap: ${(props: any) => props.theme.spacing.sm};
  }

  .author-avatar {
    width: ${(props: any) => props.theme.spacing.lg};
    height: ${(props: any) => props.theme.spacing.lg};
    border-radius: ${(props: any) => props.theme.radius.full};
    object-fit: cover;
  }

  .author-name {
    font-weight: ${(props: any) => props.theme.typography.fontWeight.medium};
    color: ${(props: any) => props.theme.colors.text.primary};
  }

  .post-timestamp {
    font-size: ${(props: any) => props.theme.typography.fontSize.sm};
    color: ${(props: any) => props.theme.colors.text.secondary};
  }
`;

export const PostCardTitle = styled.h3<{ theme: EnhancedTheme }>`
  font-size: ${(props: any) => props.theme.typography.fontSize.lg};
  font-weight: ${(props: any) => props.theme.typography.fontWeight.bold};
  color: ${(props: any) => props.theme.colors.text.primary};
  margin: 0;
  line-height: ${(props: any) => props.theme.typography.lineHeight.tight};
`;

export const PostCardContent = styled.div<{ theme: EnhancedTheme }>`
  padding: ${(props: any) => props.theme.spacing.md};
  background-color: ${(props: any) => props.theme.colors.background.primary};
  border-radius: ${(props: any) => props.theme.radius.md};
  border: 1px solid ${(props: any) => props.theme.colors.border.light};
  margin-bottom: ${(props: any) => props.theme.spacing.sm};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props: any) => props.theme.colors.border.base};
    box-shadow: ${(props: any) => props.theme.shadows.sm};
  }

  .post-body {
    color: ${(props: any) => props.theme.colors.text.primary};
    line-height: ${(props: any) => props.theme.typography.lineHeight.normal};
    margin-bottom: ${(props: any) => props.theme.spacing.sm};

    p {
      margin: 0 0 ${(props: any) => props.theme.spacing.sm} 0;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

export const PostCardFooter = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(props: any) => `${props.theme.spacing.sm} ${props.theme.spacing.md}`};
  border-top: 1px solid ${(props: any) => props.theme.colors.border.light};
  background-color: ${(props: any) => props.theme.colors.background.secondary};
  border-radius: 0 0 ${(props: any) => props.theme.radius.md} ${(props: any) => props.theme.radius.md};

  .post-actions {
    display: flex;
    align-items: center;
    gap: ${(props: any) => props.theme.spacing.sm};
  }

  .action-button {
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

    &:active {
      transform: scale(0.95);
    }
  }

  .post-meta {
    display: flex;
    align-items: center;
    gap: ${(props: any) => props.theme.spacing.sm};
    font-size: ${(props: any) => props.theme.typography.fontSize.sm};
    color: ${(props: any) => props.theme.colors.text.secondary};
    margin-top: ${(props: any) => props.theme.spacing.xs};

    .meta-item {
      display: flex;
      align-items: center;
      gap: ${(props: any) => props.theme.spacing.xs};
    }
  }
`;

// Legacy export for backward compatibility
export const PostCardStyles = {
  container: PostCardContainer,
  badge: PostCardBadge,
  header: PostCardHeader,
  title: PostCardTitle,
  content: PostCardContent,
  footer: PostCardFooter,
};

export default PostCardStyles;
