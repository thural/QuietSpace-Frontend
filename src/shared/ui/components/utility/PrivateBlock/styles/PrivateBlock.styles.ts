/**
 * PrivateBlock Component Styles
 * 
 * Enterprise Emotion CSS styles for the PrivateBlock component
 * following theme system patterns and responsive design.
 */

import { css } from '@emotion/react';
import { getSpacing, getColor, getRadius, getTypography, getShadow } from '../../../utils';

/**
 * Generates styles for private block container
 * 
 * @param theme - Enhanced theme object
 * @returns CSS object for styled component
 */
export const privateBlockContainerStyles = (theme?: any) => css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${getSpacing(theme, 'xl')};
  border-radius: ${getRadius(theme, 'lg')};
  background: ${getColor(theme, 'background.secondary')};
  border: 2px dashed ${getColor(theme, 'border.medium')};
  box-shadow: ${getShadow(theme, 'md')};
  text-align: center;
  min-height: 200px;
  
  // Responsive design
  @media (max-width: ${theme?.breakpoints?.sm || '640px'}) {
    padding: ${getSpacing(theme, 'lg')};
    min-height: 150px;
  }
`;

/**
 * Generates styles for private block icon
 * 
 * @param theme - Enhanced theme object
 * @returns CSS object for styled component
 */
export const privateBlockIconStyles = (theme?: any) => css`
  font-size: ${getTypography(theme, 'fontSize.xl')};
  color: ${getColor(theme, 'semantic.warning')};
  margin-bottom: ${getSpacing(theme, 'md')};
`;

/**
 * Generates styles for private block message
 * 
 * @param theme - Enhanced theme object
 * @returns CSS object for styled component
 */
export const privateBlockMessageStyles = (theme?: any) => css`
  font-size: ${getTypography(theme, 'fontSize.md')};
  font-weight: ${getTypography(theme, 'fontWeight.medium')};
  color: ${getColor(theme, 'text.secondary')};
  margin: 0;
  line-height: 1.4;
`;

/**
 * Generates styles for private block content area
 * 
 * @param theme - Enhanced theme object
 * @returns CSS object for styled component
 */
export const privateBlockContentStyles = (theme?: any) => css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${getSpacing(theme, 'md')};
`;
