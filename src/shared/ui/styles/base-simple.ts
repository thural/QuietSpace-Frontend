/**
 * Enterprise Base Styled Components - Simple Version
 * 
 * Base styled components that integrate with the QuietSpace enterprise theme system.
 * These components provide consistent styling patterns and accessibility features.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '@/core/theme';

/**
 * Simple base container component with theme integration
 */
export const BaseContainer = styled.div`
  box-sizing: border-box;
`;

/**
 * Simple base button component with enterprise styling
 */
export const BaseButton = styled.button<{ theme: EnhancedTheme }>`
  box-sizing: border-box;
  border: none;
  cursor: pointer;
  font-family: ${(props) => props.theme.typography.fontFamily.sans};
  font-weight: ${(props) => props.theme.typography.fontWeight.medium};
  border-radius: ${(props) => props.theme.radius.md};
  transition: all ${(props) => props.theme.animation.duration.normal} ${(props) => props.theme.animation.easing.ease};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  
  /* Default styling */
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.lg};
  font-size: ${(props) => props.theme.typography.fontSize.base};
  background-color: ${(props) => props.theme.colors.brand[500]};
  color: ${(props) => props.theme.colors.text.inverse};
  
  &:hover {
    opacity: 0.8;
  }
  
  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.brand[500]};
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

/**
 * Simple base input component with enterprise styling
 */
export const BaseInput = styled.input<{ theme: EnhancedTheme }>`
  box-sizing: border-box;
  border: 1px solid ${(props) => props.theme.colors.border.light};
  border-radius: ${(props) => props.theme.radius.sm};
  font-family: ${(props) => props.theme.typography.fontFamily.sans};
  font-size: ${(props) => props.theme.typography.fontSize.base};
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
  transition: all ${(props) => props.theme.animation.duration.normal} ${(props) => props.theme.animation.easing.ease};
  background-color: ${(props) => props.theme.colors.background.secondary};
  color: ${(props) => props.theme.colors.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.brand[500]};
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.brand[500]}20;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

/**
 * Simple base text component with typography integration
 */
export const BaseText = styled.span<{ theme: EnhancedTheme }>`
  box-sizing: border-box;
  font-family: ${(props) => props.theme.typography.fontFamily.sans};
  color: ${(props) => props.theme.colors.text.primary};
  
  /* Default body text */
  font-size: ${(props) => props.theme.typography.fontSize.base};
  font-weight: ${(props) => props.theme.typography.fontWeight.normal};
  line-height: ${(props) => props.theme.typography.lineHeight.normal};
`;

/**
 * Simple base flex container component
 */
export const BaseFlex = styled.div`
  box-sizing: border-box;
  display: flex;
`;

/**
 * Simple base center container component
 */
export const BaseCenter = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * Simple base skeleton component for loading states
 */
export const BaseSkeleton = styled.div<{ theme: EnhancedTheme }>`
  box-sizing: border-box;
  background-color: ${(props) => props.theme.colors.background.secondary};
  border-radius: ${(props) => props.theme.radius.sm};
  
  /* Animation for skeleton loading */
  @keyframes skeleton-loading {
    0% {
      background-color: ${(props) => props.theme.colors.background.secondary};
    }
    50% {
      background-color: ${(props) => props.theme.colors.border.light};
    }
    100% {
      background-color: ${(props) => props.theme.colors.background.secondary};
    }
  }
  
  animation: skeleton-loading 1.5s ease-in-out infinite;
`;

/**
 * Simple base loading overlay component
 */
export const BaseLoadingOverlay = styled.div<{ theme: EnhancedTheme }>`
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => props.theme.colors.background.transparent};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

/**
 * Simple base spinner component
 */
export const BaseSpinner = styled.div<{ theme: EnhancedTheme }>`
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  border: 2px solid ${(props) => props.theme.colors.border.light};
  border-top: 2px solid ${(props) => props.theme.colors.brand[500]};
  border-radius: 50%;
  
  /* Animation for spinner */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  animation: spin 1s linear infinite;
`;

/**
 * Simple base avatar component
 */
export const BaseAvatar = styled.div<{ theme: EnhancedTheme }>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.background.secondary};
  color: ${(props) => props.theme.colors.text.primary};
  font-weight: ${(props) => props.theme.typography.fontWeight.bold};
  border-radius: 50%;
  overflow: hidden;
  
  /* Default size */
  width: 40px;
  height: 40px;
  font-size: 16px;
`;

/**
 * Simple base progress bar component
 */
export const BaseProgress = styled.div<{ theme: EnhancedTheme }>`
  box-sizing: border-box;
  width: 100%;
  height: 8px;
  background-color: ${(props) => props.theme.colors.background.secondary};
  border-radius: ${(props) => props.theme.radius.sm};
  overflow: hidden;
`;

export const BaseProgressBar = styled.div<{ progress?: number; theme: EnhancedTheme }>`
  box-sizing: border-box;
  height: 100%;
  background-color: ${(props) => props.theme.colors.semantic.success};
  border-radius: ${(props) => props.theme.radius.sm};
  transition: width ${(props) => props.theme.animation.duration.normal} ${(props) => props.theme.animation.easing.ease};
  width: ${(props) => props.progress ? `${props.progress}%` : '0%'};
`;

/**
 * Simple base tabs container
 */
export const BaseTabsContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

export const BaseTabsList = styled.div<{ theme: EnhancedTheme }>`
  box-sizing: border-box;
  display: flex;
  border-bottom: 1px solid ${(props) => props.theme.colors.border.light};
`;

export const BaseTab = styled.button<{ active?: boolean; theme: EnhancedTheme }>`
  box-sizing: border-box;
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.lg};
  border: none;
  background: none;
  cursor: pointer;
  font-family: ${(props) => props.theme.typography.fontFamily.sans};
  font-size: ${(props) => props.theme.typography.fontSize.base};
  color: ${(props) => props.active ? props.theme.colors.brand[500] : props.theme.colors.text.secondary};
  border-bottom: 2px solid ${(props) => props.active ? props.theme.colors.brand[500] : 'transparent'};
  transition: all ${(props) => props.theme.animation.duration.normal} ${(props) => props.theme.animation.easing.ease};
  
  &:hover {
    color: ${(props) => props.theme.colors.brand[500]};
  }
  
  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.brand[500]};
    outline-offset: 2px;
  }
`;

export const BaseTabContent = styled.div<{ theme: EnhancedTheme }>`
  box-sizing: border-box;
  padding: ${(props) => props.theme.spacing.lg};
`;
