/**
 * InfinateScrollContainer Component Styles
 * 
 * Enterprise-grade Emotion CSS styles for the InfinateScrollContainer component
 * with theme integration, animations, and responsive design.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { css } from '@emotion/react';
import { 
  getSpacing, 
  getColor, 
  getTransition,
  getTypography
} from '../../../utils';

/**
 * Base container styles for infinite scroll container
 */
export const infinateScrollContainerBaseStyles = (theme?: any) => css`
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

/**
 * Scroll trigger container styles
 */
export const scrollTriggerStyles = (theme?: any) => css`
  width: 100%;
  height: ${getSpacing(theme, 'xl')};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
`;

/**
 * Loading indicator container styles
 */
export const loadingContainerStyles = (theme?: any) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${getSpacing(theme, 'lg')};
  width: 100%;
`;

/**
 * Loading spinner styles
 */
export const loadingSpinnerStyles = (theme?: any, size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'sm') => css`
  width: ${getLoadingSize(size)};
  height: ${getLoadingSize(size)};
  border: ${getSpacing(theme, 'border.width.sm')} solid ${getColor(theme, 'border.light')};
  border-top: ${getSpacing(theme, 'border.width.sm')} solid ${getColor(theme, 'brand.500')};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  transition: ${getTransition(theme, 'all', 'fast', 'ease')};

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

/**
 * Get loading spinner size based on size prop
 */
const getLoadingSize = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
  const sizeMap = {
    xs: '16px',
    sm: '20px',
    md: '24px',
    lg: '32px',
    xl: '40px'
  };
  return sizeMap[size] || sizeMap.sm;
};

/**
 * Responsive styles for mobile devices
 */
export const infinateScrollResponsiveStyles = (theme?: any) => css`
  @media (max-width: ${getTypography(theme, 'breakpoints.sm')}) {
    ${scrollTriggerStyles(theme)} {
      height: ${getSpacing(theme, 'lg')};
    }
    
    ${loadingContainerStyles(theme)} {
      padding: ${getSpacing(theme, 'md')};
    }
  }
`;
