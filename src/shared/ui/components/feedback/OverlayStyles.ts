import styled from 'styled-components';
import { EnhancedTheme } from '@/core/theme';

// Enterprise styled-components for overlay styling
export const OverlayWrapper = styled.div<{ theme: EnhancedTheme }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
`;

export const OverlayBackdrop = styled.div<{ theme: EnhancedTheme }>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  display: block;
  backdrop-filter: blur(32px);
  background: rgba(128, 128, 128, 0.1);
  transition: all ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    background: rgba(128, 128, 128, 0.15);
  }
`;

export const OverlayContent = styled.div<{ theme: EnhancedTheme }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.radius.lg};
  box-shadow: ${props => props.theme.shadows.lg};
  padding: ${props => props.theme.spacing.lg};
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1001;
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing.md};
    max-width: 95vw;
    max-height: 95vh;
  }
`;

export const OverlayCloseButton = styled.button<{ theme: EnhancedTheme }>`
  position: absolute;
  top: ${props => props.theme.spacing.sm};
  right: ${props => props.theme.spacing.sm};
  background: transparent;
  border: none;
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.radius.sm};
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    background: ${props => props.theme.colors.background.secondary};
    color: ${props => props.theme.colors.text.primary};
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.brand[300]};
    outline-offset: 2px;
  }
`;
