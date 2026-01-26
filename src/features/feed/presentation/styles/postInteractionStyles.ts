/**
 * Post Interaction Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and enhanced theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '@core/theme';

export const StatsSection = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  height: ${(props: any) => props.theme.spacing.md};
  gap: ${(props: any) => props.theme.spacing.sm};
  font-size: ${(props: any) => props.theme.typography.fontSize.base};
  margin: ${(props: any) => props.theme.spacing.md} 0;
  color: ${(props: any) => props.theme.colors.text.secondary};
  transition: all 0.2s ease;

  &:hover {
    color: ${(props: any) => props.theme.colors.text.primary};
  }
`;

export const InteractionButton = styled.button<{ theme: EnhancedTheme; variant?: 'default' | 'primary' | 'danger' }>`
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
    min-width: 16px;
    text-align: center;
  }

  .tooltip {
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

  &:hover .tooltip {
    opacity: 1;
    visibility: visible;
  }
`;

export const InteractionGroup = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  gap: ${(props: any) => props.theme.spacing.sm};
  padding: ${(props: any) => props.theme.spacing.xs};
  border-radius: ${(props: any) => props.theme.radius.sm};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props: any) => props.theme.colors.background.secondary};
  }
`;

export const InteractionSeparator = styled.div<{ theme: EnhancedTheme }>`
  width: 1px;
  height: ${(props: any) => props.theme.spacing.lg};
  background-color: ${(props: any) => props.theme.colors.border.light};
  margin: 0 ${(props: any) => props.theme.spacing.xs};
`;

export const ShareMenu = styled.div<{ theme: EnhancedTheme; isOpen?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;

  .share-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: ${(props: any) => props.theme.colors.background.primary};
    border: 1px solid ${(props: any) => props.theme.colors.border.light};
    border-radius: ${(props: any) => props.theme.radius.md};
    box-shadow: ${(props: any) => props.theme.shadows.md};
    z-index: ${(props: any) => props.theme.zIndex.modal};
    min-width: ${(props: any) => props.theme.spacing.xl};
    opacity: ${(props: any) => props.isOpen ? 1 : 0};
    visibility: ${(props: any) => props.isOpen ? 'visible' : 'hidden'};
    transform: ${(props: any) => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
    transition: all 0.3s ease;
    margin-top: ${(props: any) => props.theme.spacing.xs};

    .share-option {
      padding: ${(props: any) => props.theme.spacing.sm} ${(props: any) => props.theme.spacing.md};
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: ${(props: any) => props.theme.spacing.sm};
      color: ${(props: any) => props.theme.colors.text.primary};

      &:hover {
        background-color: ${(props: any) => props.theme.colors.background.secondary};
        color: ${(props: any) => props.theme.colors.brand[500]};
      }

      svg {
        font-size: ${(props: any) => props.theme.typography.fontSize.base};
      }
    }
  }
`;

// Legacy export for backward compatibility during migration
export const PostInteractionStyles = {
  statsSection: StatsSection,
  interactionButton: InteractionButton,
  interactionGroup: InteractionGroup,
  separator: InteractionSeparator,
  shareMenu: ShareMenu,
};

export default PostInteractionStyles;