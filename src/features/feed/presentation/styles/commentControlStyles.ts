/**
 * Comment Control Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and enhanced theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const CommentOptions = styled.div<{ theme: EnhancedTheme }>`
  width: 100%;
  justify-content: flex-start;
  gap: ${(props: any) => props.theme.spacing.sm};
  color: ${(props: any) => props.theme.colors.text.primary};
  display: flex;
  flex-flow: row nowrap;
  font-size: ${(props: any) => props.theme.typography.fontSize.sm};
  font-weight: ${(props: any) => props.theme.typography.fontWeight.bold};
  padding: ${(props: any) => props.theme.spacing.xs};
  border-radius: ${(props: any) => props.theme.radius.sm};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props: any) => props.theme.colors.background.secondary};
  }

  & > * {
    cursor: pointer;
    transition: all 0.2s ease;
    padding: ${(props: any) => props.theme.spacing.xs};
    border-radius: ${(props: any) => props.theme.radius.sm};
    display: flex;
    align-items: center;
    gap: ${(props: any) => props.theme.spacing.xs};

    &:hover {
      background-color: ${(props: any) => props.theme.colors.background.secondary};
      color: ${(props: any) => props.theme.colors.brand[500]};
    }

    &:active {
      transform: scale(0.95);
    }
  }

  & p {
    margin: 0;
    font-size: ${(props: any) => props.theme.typography.fontSize.sm};
    color: ${(props: any) => props.theme.colors.text.secondary};
    font-weight: ${(props: any) => props.theme.typography.fontWeight.normal};
  }

  svg {
    font-size: ${(props: any) => props.theme.typography.fontSize.base};
    color: ${(props: any) => props.theme.colors.text.secondary};
    transition: all 0.2s ease;
  }

  &:hover svg {
    color: ${(props: any) => props.theme.colors.brand[500]};
  }
`;

export const CommentControlItem = styled.button<{ theme: EnhancedTheme; variant?: 'default' | 'danger' }>`
  background: none;
  border: none;
  padding: ${(props: any) => props.theme.spacing.xs};
  border-radius: ${(props: any) => props.theme.radius.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${(props: any) => props.theme.spacing.xs};
  font-size: ${(props: any) => props.theme.typography.fontSize.sm};
  font-weight: ${(props: any) => props.theme.typography.fontWeight.normal};
  color: ${(props: any) => {
    switch (props.variant) {
      case 'danger':
        return props.theme.colors.semantic.error;
      default:
        return props.theme.colors.text.secondary;
    }
  }};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props: any) => {
    switch (props.variant) {
      case 'danger':
        return props.theme.colors.semantic.error + '10';
      default:
        return props.theme.colors.background.secondary;
    }
  }};
    color: ${(props: any) => {
    switch (props.variant) {
      case 'danger':
        return props.theme.colors.text.primary;
      default:
        return props.theme.colors.brand[500];
    }
  }};
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
  }
`;

export const CommentControlSeparator = styled.div<{ theme: EnhancedTheme }>`
  width: 1px;
  height: ${(props: any) => props.theme.spacing.lg};
  background-color: ${(props: any) => props.theme.colors.border.light};
  margin: 0 ${(props: any) => props.theme.spacing.xs};
`;

export const CommentControlGroup = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  gap: ${(props: any) => props.theme.spacing.xs};
  padding: ${(props: any) => props.theme.spacing.xs};
  border-radius: ${(props: any) => props.theme.radius.sm};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props: any) => props.theme.colors.background.secondary};
  }
`;

export const CommentControlDropdown = styled.div<{ theme: EnhancedTheme; isOpen?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;

  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
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

    .dropdown-item {
      padding: ${(props: any) => props.theme.spacing.sm} ${(props: any) => props.theme.spacing.md};
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: ${(props: any) => props.theme.spacing.sm};

      &:hover {
        background-color: ${(props: any) => props.theme.colors.background.secondary};
      }

      &:first-child {
        border-radius: ${(props: any) => props.theme.radius.md} ${(props: any) => props.theme.radius.md} 0 0;
      }

      &:last-child {
        border-radius: 0 0 ${(props: any) => props.theme.radius.md} ${(props: any) => props.theme.radius.md};
      }
    }
  }
`;

// Legacy export for backward compatibility during migration
export const CommentControlStyles = {
  commentOptions: CommentOptions,
  controlItem: CommentControlItem,
  separator: CommentControlSeparator,
  controlGroup: CommentControlGroup,
  dropdown: CommentControlDropdown,
};

export default CommentControlStyles;