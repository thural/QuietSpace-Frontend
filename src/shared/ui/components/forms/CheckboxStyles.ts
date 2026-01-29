import styled, { css } from 'styled-components';
import { EnhancedTheme } from '@/core/theme';

// Enterprise styled-components for checkbox styling
export const CheckboxWrapper = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  margin: ${props => props.theme.spacing.xs} 0;
`;

export const CheckboxInput = styled.input<{ theme: EnhancedTheme; variant?: 'default' | 'primary' | 'secondary' }>`
  width: 20px;
  height: 20px;
  appearance: none;
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.radius.full};
  outline: none;
  cursor: pointer;
  margin-right: ${props => props.theme.spacing.sm};
  position: relative;
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    border-color: ${props => props.theme.colors.border.dark};
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.brand[300]};
    outline-offset: 2px;
  }
  
  &:checked {
    background: ${props => {
      switch (props.variant) {
        case 'primary':
          return props.theme.colors.brand[500];
        case 'secondary':
          return props.theme.colors.background.secondary;
        default:
          return props.theme.colors.brand[500];
      }
    }};
    border-color: ${props => {
      switch (props.variant) {
        case 'primary':
          return props.theme.colors.brand[500];
        case 'secondary':
          return props.theme.colors.border.medium;
        default:
          return props.theme.colors.brand[500];
      }
    }};
  }
  
  &:checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    background: ${props => props.theme.colors.text.inverse};
    border-radius: 50%;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const CheckboxLabel = styled.label<{ theme: EnhancedTheme }>`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  user-select: none;
  
  &:hover {
    color: ${props => props.theme.colors.text.secondary};
  }
`;
