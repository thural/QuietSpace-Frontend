/**
 * Enterprise Base Styled Components - Simple Version
 * 
 * Base styled components that integrate with the QuietSpace enterprise theme system.
 * These components provide consistent styling patterns and accessibility features.
 */

import styled from 'styled-components';
import { Theme } from '@/app/theme';

/**
 * Simple base container component with theme integration
 */
export const BaseContainer = styled.div`
  box-sizing: border-box;
`;

/**
 * Simple base button component with enterprise styling
 */
export const BaseButton = styled.button`
  box-sizing: border-box;
  border: none;
  cursor: pointer;
  font-family: ${(props) => props.theme.typography.fontFamily};
  font-weight: ${(props) => props.theme.typography.fontWeightRegular};
  border-radius: ${(props) => props.theme.radius.md};
  transition: ${(props) => props.theme.transitions.default};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  
  /* Default styling */
  padding: ${(props) => props.theme.spacing(0.75)} ${(props) => props.theme.spacing(1.5)};
  font-size: ${(props) => props.theme.typography.fontSize.primary};
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.textMax};
  
  &:hover {
    opacity: 0.8;
  }
  
  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.primary};
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
export const BaseInput = styled.input`
  box-sizing: border-box;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radius.sm};
  font-family: ${(props) => props.theme.typography.fontFamily};
  font-size: ${(props) => props.theme.typography.fontSize.primary};
  padding: ${(props) => props.theme.spacing(0.75)} ${(props) => props.theme.spacing(1)};
  transition: ${(props) => props.theme.transitions.default};
  background-color: ${(props) => props.theme.colors.inputField};
  color: ${(props) => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.primary}20;
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
export const BaseText = styled.span`
  box-sizing: border-box;
  font-family: ${(props) => props.theme.typography.fontFamily};
  color: ${(props) => props.theme.colors.text};
  
  /* Default body text */
  font-size: ${(props) => props.theme.typography.fontSize.primary};
  font-weight: ${(props) => props.theme.typography.fontWeightRegular};
  line-height: ${(props) => props.theme.typography.lineHeight};
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
export const BaseSkeleton = styled.div`
  box-sizing: border-box;
  background-color: ${(props) => props.theme.colors.backgroundSecondary};
  border-radius: ${(props) => props.theme.radius.sm};
  
  /* Animation for skeleton loading */
  @keyframes skeleton-loading {
    0% {
      background-color: ${(props) => props.theme.colors.backgroundSecondary};
    }
    50% {
      background-color: ${(props) => props.theme.colors.border};
    }
    100% {
      background-color: ${(props) => props.theme.colors.backgroundSecondary};
    }
  }
  
  animation: skeleton-loading 1.5s ease-in-out infinite;
`;

/**
 * Simple base loading overlay component
 */
export const BaseLoadingOverlay = styled.div`
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => props.theme.colors.backgroundTransparentMax};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${(props) => props.theme.zIndex.modal};
`;

/**
 * Simple base spinner component
 */
export const BaseSpinner = styled.div`
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  border: 2px solid ${(props) => props.theme.colors.border};
  border-top: 2px solid ${(props) => props.theme.colors.primary};
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
export const BaseAvatar = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.backgroundSecondary};
  color: ${(props) => props.theme.colors.text};
  font-weight: ${(props) => props.theme.typography.fontWeightBold};
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
export const BaseProgress = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 8px;
  background-color: ${(props) => props.theme.colors.backgroundSecondary};
  border-radius: ${(props) => props.theme.radius.sm};
  overflow: hidden;
`;

export const BaseProgressBar = styled.div<{ progress?: number }>`
  box-sizing: border-box;
  height: 100%;
  background-color: ${(props) => props.theme.colors.success};
  border-radius: ${(props) => props.theme.radius.sm};
  transition: width ${(props) => props.theme.transitions.default};
  width: ${(props) => props.progress ? `${props.progress}%` : '0%';
`;

/**
 * Simple base tabs container
 */
export const BaseTabsContainer = styled.div`
box - sizing: border - box;
display: flex;
flex - direction: column;
`;

export const BaseTabsList = styled.div`
box - sizing: border - box;
display: flex;
border - bottom: 1px solid ${ (props) => props.theme.colors.border };
`;

export const BaseTab = styled.button<{ active?: boolean }>`
box - sizing: border - box;
padding: ${ (props) => props.theme.spacing(0.75) } ${ (props) => props.theme.spacing(1.5) };
border: none;
background: none;
cursor: pointer;
font - family: ${ (props) => props.theme.typography.fontFamily };
font - size: ${ (props) => props.theme.typography.fontSize.primary };
color: ${ (props) => props.active ? props.theme.colors.primary : props.theme.colors.textSecondary };
border - bottom: 2px solid ${ (props) => props.active ? props.theme.colors.primary : 'transparent' };
transition: ${ (props) => props.theme.transitions.default };
  
  &:hover {
  color: ${ (props) => props.theme.colors.primary };
}
  
  &:focus {
  outline: 2px solid ${ (props) => props.theme.colors.primary };
  outline - offset: 2px;
}
`;

export const BaseTabContent = styled.div`
box - sizing: border - box;
padding: ${ (props) => props.theme.spacing(1.5) };
`;
