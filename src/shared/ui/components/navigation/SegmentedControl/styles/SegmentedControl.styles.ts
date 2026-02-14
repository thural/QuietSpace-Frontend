/**
 * SegmentedControl Component Styles
 * 
 * Enterprise-grade Emotion CSS styles for the SegmentedControl component
 * with theme integration, animations, and responsive design.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { css } from '@emotion/react';
import { 
  getSpacing, 
  getColor, 
  getRadius, 
  getTransition,
  getTypography
} from '../../../utils';

/**
 * Base container styles for the segmented control
 */
export const segmentedContainerStyles = (theme?: any) => css`
  display: flex;
  background-color: ${getColor(theme, 'background.secondary')};
  border-radius: ${getRadius(theme, 'sm')};
  padding: ${getSpacing(theme, 'xs')};
  width: fit-content;
`;

/**
 * Styles for individual segment buttons
 */
export const segmentedButtonStyles = (
  theme?: any,
  active: boolean = false,
  color: string = 'brand.500'
) => css`
  background: ${active ?
        getColor(theme, color) :
        'transparent'};
  color: ${active ?
        getColor(theme, 'text.inverse') :
        getColor(theme, 'text.primary')};
  border: none;
  padding: ${getSpacing(theme, 'sm')} ${getSpacing(theme, 'lg')};
  cursor: pointer;
  font-size: ${getTypography(theme, 'fontSize.base')};
  border-radius: ${getRadius(theme, 'xs')};
  transition: ${getTransition(theme, 'all', 'fast', 'ease')};
  font-weight: ${getTypography(theme, 'fontWeight.medium')};
  white-space: nowrap;
  position: relative;

  &:hover {
    background: ${active ?
        getColor(theme, color) :
        getColor(theme, 'background.tertiary')};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 ${getSpacing(theme, '2')} ${getColor(theme, 'brand.200')};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/**
 * Size variant styles for segmented controls
 */
export const segmentedSizeStyles = (
  theme?: any,
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'
) => {
  const sizeMap = {
    xs: css`
      padding: ${getSpacing(theme, 'xs')} ${getSpacing(theme, 'sm')};
      font-size: ${getTypography(theme, 'fontSize.xs')};
    `,
    sm: css`
      padding: ${getSpacing(theme, 'sm')} ${getSpacing(theme, 'md')};
      font-size: ${getTypography(theme, 'fontSize.sm')};
    `,
    md: css`
      padding: ${getSpacing(theme, 'sm')} ${getSpacing(theme, 'lg')};
      font-size: ${getTypography(theme, 'fontSize.base')};
    `,
    lg: css`
      padding: ${getSpacing(theme, 'md')} ${getSpacing(theme, 'xl')};
      font-size: ${getTypography(theme, 'fontSize.lg')};
    `,
    xl: css`
      padding: ${getSpacing(theme, 'md')} ${getSpacing(theme, 'xxl')};
      font-size: ${getTypography(theme, 'fontSize.xl')};
    `
  };

  return sizeMap[size] || sizeMap.md;
};

/**
 * Full width styles for segmented controls
 */
export const segmentedFullWidthStyles = () => css`
  width: 100%;
  
  ${segmentedButtonStyles()} {
    flex: 1;
  }
`;

/**
 * Compact variant styles
 */
export const segmentedCompactStyles = (theme?: any) => css`
  padding: ${getSpacing(theme, 'xxs')};
  gap: ${getSpacing(theme, 'xxs')};
  
  ${segmentedButtonStyles(theme, false)} {
    padding: ${getSpacing(theme, 'xs')} ${getSpacing(theme, 'sm')};
    font-size: ${getTypography(theme, 'fontSize.sm')};
  }
`;

/**
 * Pills variant styles
 */
export const segmentedPillsStyles = (theme?: any, color: string = 'brand.500') => css`
  background-color: transparent;
  gap: ${getSpacing(theme, 'sm')};
  
  ${segmentedButtonStyles(theme, false, color)} {
    background-color: ${getColor(theme, 'background.tertiary')};
    border: ${getSpacing(theme, 'border.width.sm')} solid ${getColor(theme, 'border.light')};
    border-radius: ${getRadius(theme, 'md')};
    
    &.active {
      background-color: ${getColor(theme, color)};
      border-color: ${getColor(theme, color)};
      color: ${getColor(theme, 'text.inverse')};
    }
    
    &:hover:not(.active) {
      background-color: ${getColor(theme, 'background.secondary')};
      border-color: ${getColor(theme, 'border.medium')};
    }
  }
`;

/**
 * Responsive styles for mobile devices
 */
export const segmentedResponsiveStyles = (theme?: any) => css`
  @media (max-width: ${getTypography(theme, 'breakpoints.sm')}) {
    ${segmentedContainerStyles(theme)} {
      width: 100%;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
      
      &::-webkit-scrollbar {
        display: none;
      }
    }
    
    ${segmentedButtonStyles(theme, false)} {
      padding: ${getSpacing(theme, 'xs')} ${getSpacing(theme, 'md')};
      font-size: ${getTypography(theme, 'fontSize.sm')};
      min-width: fit-content;
    }
  }
`;
