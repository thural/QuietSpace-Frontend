/**
 * Post Stats Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and enhanced theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const PostStats = styled.div<{ theme: EnhancedTheme }>`
  opacity: 0.75;
  margin-left: auto;
  gap: ${(props: any) => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  color: ${(props: any) => props.theme.colors.text.secondary};

  &:hover {
    opacity: 1;
    color: ${(props: any) => props.theme.colors.text.primary};
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: ${(props: any) => props.theme.spacing.xs};
    cursor: pointer;
    padding: ${(props: any) => props.theme.spacing.xs};
    border-radius: ${(props: any) => props.theme.radius.sm};
    transition: all 0.2s ease;

    &:hover {
      background-color: ${(props: any) => props.theme.colors.background.secondary};
    }

    &:active {
      transform: scale(0.95);
    }

    svg {
      font-size: ${(props: any) => props.theme.typography.fontSize.base};
      transition: all 0.2s ease;
    }

    .count {
      font-size: ${(props: any) => props.theme.typography.fontSize.sm};
      font-weight: ${(props: any) => props.theme.typography.fontWeight.normal};
      min-width: 12px;
      text-align: center;
    }
  }

  .stat-separator {
    width: 1px;
    height: ${(props: any) => props.theme.spacing.lg};
    background-color: ${(props: any) => props.theme.colors.border.light};
    margin: 0 ${(props: any) => props.theme.spacing.xs};
  }

  .stat-group {
    display: flex;
    align-items: center;
    gap: ${(props: any) => props.theme.spacing.sm};
    padding: ${(props: any) => props.theme.spacing.xs};
    border-radius: ${(props: any) => props.theme.radius.sm};
    transition: all 0.2s ease;

    &:hover {
      background-color: ${(props: any) => props.theme.colors.background.secondary};
    }
  }

  .stat-tooltip {
    position: relative;
    display: flex;
    align-items: center;

    .tooltip-content {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background-color: ${(props: any) => props.theme.colors.background.secondary};
      color: ${(props: any) => props.theme.colors.text.primary};
      padding: ${(props: any) => props.theme.spacing.xs} ${(props: any) => props.theme.spacing.sm};
      border-radius: ${(props: any) => props.theme.radius.sm};
      font-size: ${(props: any) => props.theme.typography.fontSize.sm};
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;
      margin-bottom: ${(props: any) => props.theme.spacing.xs};
      box-shadow: ${(props: any) => props.theme.shadows.md};
      z-index: ${(props: any) => props.theme.zIndex.modal};

      &::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 4px solid transparent;
        border-top-color: ${(props: any) => props.theme.colors.background.secondary};
      }
    }

    &:hover .tooltip-content {
      opacity: 1;
      visibility: visible;
    }
  }

  @media (max-width: ${(props: any) => props.theme.breakpoints.sm}) {
    flex-wrap: wrap;
    gap: ${(props: any) => props.theme.spacing.sm};
    margin-left: 0;
    margin-top: ${(props: any) => props.theme.spacing.sm};
  }
`;

export const PostStatItem = styled.button<{ theme: EnhancedTheme; variant?: 'default' | 'primary' | 'danger' }>`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${(props: any) => props.theme.spacing.xs};
  padding: ${(props: any) => props.theme.spacing.xs};
  border-radius: ${(props: any) => props.theme.radius.sm};
  font-size: ${(props: any) => props.theme.typography.fontSize.base};
  color: ${(props: any) => {
    switch (props.variant) {
      case 'primary':
        return props.theme.colors.brand[500];
      case 'danger':
        return props.theme.colors.semantic.error;
      default:
        return props.theme.colors.text.secondary;
    }
  }};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    color: ${(props: any) => {
    switch (props.variant) {
      case 'primary':
        return props.theme.colors.brand[500];
      case 'danger':
        return props.theme.colors.semantic.error;
      default:
        return props.theme.colors.text.primary;
    }
  }};
    background-color: ${(props: any) => props.theme.colors.background.secondary};
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    color: ${(props: any) => props.theme.colors.text.secondary};
  }

  svg {
    font-size: ${(props: any) => props.theme.typography.fontSize.base};
    transition: all 0.2s ease;
  }

  .count {
    font-size: ${(props: any) => props.theme.typography.fontSize.sm};
    font-weight: ${(props: any) => props.theme.typography.fontWeight.normal};
    min-width: 12px;
    text-align: center;
  }
`;

export const PostStatCount = styled.span<{ theme: EnhancedTheme; isActive?: boolean }>`
  font-size: ${(props: any) => props.theme.typography.fontSize.sm};
  font-weight: ${(props: any) => props.isActive ? props.theme.typography.fontWeight.bold : props.theme.typography.fontWeight.normal};
  color: ${(props: any) => props.isActive ? props.theme.colors.text.primary : props.theme.colors.text.secondary};
  min-width: 12px;
  text-align: center;
  transition: all 0.2s ease;
`;

export const PostStatIcon = styled.span<{ theme: EnhancedTheme; isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  svg {
    font-size: ${(props: any) => props.theme.typography.fontSize.base};
    color: ${(props: any) => props.isActive ? props.theme.colors.text.primary : props.theme.colors.text.secondary};
    transition: all 0.2s ease;
  }

  &:hover svg {
    color: ${(props: any) => props.theme.colors.brand[500]};
  }
`;

// Legacy export for backward compatibility during migration
export const PostStatStyles = {
  postStats: PostStats,
  statItem: PostStatItem,
  statCount: PostStatCount,
  statIcon: PostStatIcon,
};

export default PostStatStyles;