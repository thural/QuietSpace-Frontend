import styled from 'styled-components';
import { EnhancedTheme } from '@/core/theme';

// Enterprise styled-components for profile controls styling
export const ProfileControlsContainer = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.xs};
  }
`;

export const ProfileButton = styled.button<{ theme: EnhancedTheme; variant?: 'primary' | 'secondary' }>`
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.radius.sm};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  
  // Variant styles
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${props.theme.colors.brand[500]};
          color: ${props.theme.colors.text.inverse};
          border: 1px solid ${props.theme.colors.brand[500]};
          
          &:hover {
            background: ${props.theme.colors.brand[600]};
            border-color: ${props.theme.colors.brand[600]};
          }
        `;
      case 'secondary':
      default:
        return `
          background: ${props.theme.colors.background.secondary};
          color: ${props.theme.colors.text.primary};
          border: 1px solid ${props.theme.colors.border.medium};
          
          &:hover {
            background: ${props.theme.colors.background.tertiary};
            border-color: ${props.theme.colors.border.dark};
          }
        `;
    }
  }}
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.brand[300]};
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  }
`;
