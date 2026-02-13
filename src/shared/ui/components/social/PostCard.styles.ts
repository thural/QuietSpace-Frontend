/**
 * PostCard Component Styles - Enterprise Styled-Components
 * 
 * Migrated from feature-specific implementations to provide
 * consistent styling across the application.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/modules/theming';
import { getSpacing, getColor, getTypography, getRadius, getShadow, getTransition, getBorderWidth } from '../utils';

export const PostCardContainer = styled.div<{ theme: EnhancedTheme }>`
  padding: 0;
  position: relative;
  font-size: ${(props: any) => getTypography(props.theme, 'fontSize.base')};
  margin: ${(props: any) => `${getSpacing(props.theme, 'md')} 0`};
  border-radius: ${(props: any) => getRadius(props.theme, 'md')};
  background-color: ${(props: any) => getColor(props.theme, 'background.primary')};
  border: ${(props: any) => getBorderWidth(props.theme, 'sm')} solid ${(props: any) => getColor(props.theme, 'border.light')};
  transition: ${(props: any) => getTransition(props.theme, 'all', 'fast', 'ease')};
  cursor: ${(props: any) => props.onClick ? 'pointer' : 'default'};

  &:hover {
    border-color: ${(props: any) => getColor(props.theme, 'border.base')};
    box-shadow: ${(props: any) => getShadow(props.theme, 'sm')};
  }

  &.hovered {
    transform: translateY(-2px);
  }
`;

export const PostCardBadge = styled.div<{ theme: EnhancedTheme }>`
  position: absolute;
  left: ${(props: any) => getSpacing(props.theme, 'sm')};
  bottom: ${(props: any) => getSpacing(props.theme, 'lg')};
  min-width: ${(props: any) => getSpacing(props.theme, 'sm')};
  height: ${(props: any) => getSpacing(props.theme, 'sm')};
  border-radius: ${(props: any) => getRadius(props.theme, 'full')};
  background-color: ${(props: any) => getColor(props.theme, 'brand.500')};
  color: ${(props: any) => getColor(props.theme, 'text.primary')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props: any) => getTypography(props.theme, 'fontSize.sm')};
  font-weight: ${(props: any) => getTypography(props.theme, 'fontWeight.bold')};
  box-shadow: ${(props: any) => getShadow(props.theme, 'sm')};
  z-index: ${(props: any) => props.theme.zIndex.above};

  .badge-content {
    background-color: ${(props: any) => getColor(props.theme, 'border.light')};
    color: ${(props: any) => getColor(props.theme, 'text.primary')};
    border-radius: ${(props: any) => getRadius(props.theme, 'sm')};
    padding: ${(props: any) => `${getSpacing(props.theme, 'xs')} ${getSpacing(props.theme, 'sm')}`};
    font-size: ${(props: any) => getTypography(props.theme, 'fontSize.sm')};
    font-weight: ${(props: any) => getTypography(props.theme, 'fontWeight.normal')};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: ${(props: any) => getSpacing(props.theme, 'xl')};
  }
`;

export const PostCardHeader = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(props: any) => getSpacing(props.theme, 'sm')};
  padding: 0 ${(props: any) => getSpacing(props.theme, 'md')};

  .author-info {
    display: flex;
    align-items: center;
    gap: ${(props: any) => getSpacing(props.theme, 'sm')};
  }

  .author-avatar {
    width: ${(props: any) => getSpacing(props.theme, 'lg')};
    height: ${(props: any) => getSpacing(props.theme, 'lg')};
    border-radius: ${(props: any) => getRadius(props.theme, 'full')};
    object-fit: cover;
  }

  .author-name {
    font-weight: ${(props: any) => getTypography(props.theme, 'fontWeight.medium')};
    color: ${(props: any) => getColor(props.theme, 'text.primary')};
  }

  .post-timestamp {
    font-size: ${(props: any) => getTypography(props.theme, 'fontSize.sm')};
    color: ${(props: any) => getColor(props.theme, 'text.secondary')};
  }
`;

export const PostCardTitle = styled.h3<{ theme: EnhancedTheme }>`
  font-size: ${(props: any) => getTypography(props.theme, 'fontSize.lg')};
  font-weight: ${(props: any) => getTypography(props.theme, 'fontWeight.bold')};
  color: ${(props: any) => getColor(props.theme, 'text.primary')};
  margin: 0;
  line-height: ${(props: any) => getTypography(props.theme, 'lineHeight.tight')};
`;

export const PostCardContent = styled.div<{ theme: EnhancedTheme }>`
  padding: ${(props: any) => getSpacing(props.theme, 'md')};
  background-color: ${(props: any) => getColor(props.theme, 'background.primary')};
  border-radius: ${(props: any) => getRadius(props.theme, 'md')};
  border: ${(props: any) => getBorderWidth(props.theme, 'sm')} solid ${(props: any) => getColor(props.theme, 'border.light')};
  margin-bottom: ${(props: any) => getSpacing(props.theme, 'sm')};
  transition: ${(props: any) => getTransition(props.theme, 'all', 'fast', 'ease')};

  &:hover {
    border-color: ${(props: any) => getColor(props.theme, 'border.base')};
    box-shadow: ${(props: any) => getShadow(props.theme, 'sm')};
  }

  .post-body {
    color: ${(props: any) => getColor(props.theme, 'text.primary')};
    line-height: ${(props: any) => getTypography(props.theme, 'lineHeight.normal')};
    margin-bottom: ${(props: any) => getSpacing(props.theme, 'sm')};

    p {
      margin: 0 0 ${(props: any) => getSpacing(props.theme, 'sm')} 0;

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
  padding: ${(props: any) => `${getSpacing(props.theme, 'sm')} ${getSpacing(props.theme, 'md')}`};
  border-top: ${(props: any) => getBorderWidth(props.theme, 'sm')} solid ${(props: any) => getColor(props.theme, 'border.light')};
  background-color: ${(props: any) => getColor(props.theme, 'background.secondary')};
  border-radius: 0 0 ${(props: any) => getRadius(props.theme, 'md')} ${(props: any) => getRadius(props.theme, 'md')};

  .post-actions {
    display: flex;
    align-items: center;
    gap: ${(props: any) => getSpacing(props.theme, 'sm')};
  }

  .action-button {
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

    &:active {
      transform: scale(0.95);
    }
  }

  .post-meta {
    display: flex;
    align-items: center;
    gap: ${(props: any) => getSpacing(props.theme, 'sm')};
    font-size: ${(props: any) => getTypography(props.theme, 'fontSize.sm')};
    color: ${(props: any) => getColor(props.theme, 'text.secondary')};
    margin-top: ${(props: any) => getSpacing(props.theme, 'xs')};

    .meta-item {
      display: flex;
      align-items: center;
      gap: ${(props: any) => getSpacing(props.theme, 'xs')};
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
