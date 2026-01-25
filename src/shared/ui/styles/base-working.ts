/**
 * Enterprise Base Styled Components - Working Version
 * 
 * Simple styled components that work with the existing theme system.
 */

import styled from 'styled-components';

/**
 * Simple base container component
 */
export const BaseContainer = styled.div`
  box-sizing: border-box;
`;

/**
 * Simple base button component
 */
export const BaseButton = styled.button`
  box-sizing: border-box;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  
  /* Default styling */
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:focus {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

/**
 * Simple base input component
 */
export const BaseInput = styled.input`
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: currentColor;
    box-shadow: 0 0 0 2px currentColor20;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

/**
 * Simple base text component
 */
export const BaseText = styled.span`
  box-sizing: border-box;
  
  /* Default body text */
  font-size: 1rem;
  line-height: 1.5;
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
  background-color: #f0f0f0;
  border-radius: 0.25rem;
  
  /* Animation for skeleton loading */
  @keyframes skeleton-loading {
    0% { background-color: #f0f0f0; }
    50% { background-color: #e0e0e0; }
    100% { background-color: #f0f0f0; }
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
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

/**
 * Simple base spinner component
 */
export const BaseSpinner = styled.div`
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  border: 2px solid #ccc;
  border-top: 2px solid currentColor;
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
  background-color: #f0f0f0;
  color: #333;
  font-weight: bold;
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
  background-color: #f0f0f0;
  border-radius: 0.25rem;
  overflow: hidden;
`;

export const BaseProgressBar = styled.div<{ progress?: number }>`
  box-sizing: border-box;
  height: 100%;
  background-color: #4caf50;
  border-radius: 0.25rem;
  transition: width 0.3s ease;
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

export const BaseTabsList = styled.div`
  box-sizing: border-box;
  display: flex;
  border-bottom: 1px solid #ccc;
`;

export const BaseTab = styled.button<{ active?: boolean }>`
  box-sizing: border-box;
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  color: ${(props) => props.active ? 'currentColor' : '#666'};
  border-bottom: 2px solid ${(props) => props.active ? 'currentColor' : 'transparent'};
  transition: all 0.3s ease;
  
  &:hover {
    color: currentColor;
  }
  
  &:focus {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;

export const BaseTabContent = styled.div`
  box-sizing: border-box;
  padding: 1.5rem;
`;
