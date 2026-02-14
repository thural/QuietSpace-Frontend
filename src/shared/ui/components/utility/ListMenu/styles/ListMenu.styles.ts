/**
 * ListMenu Styles
 * 
 * Enterprise Emotion CSS styles for the ListMenu component
 * following theme system patterns and responsive design.
 */

import { css } from '@emotion/react';
import { getSpacing, getColor, getRadius, getShadow, getBorderWidth, getBreakpoint } from '../../../utils';
import { IMenuListStyleProps } from '../interfaces';

/**
 * Generates styles for menu container
 * 
 * @param theme - Enhanced theme object
 * @returns CSS object for styled component
 */
export const menuContainerStyles = (theme?: any) => css`
  position: relative;
  display: inline-block;
`;

/**
 * Generates styles for menu icon/trigger
 * 
 * @param theme - Enhanced theme object
 * @returns CSS object for styled component
 */
export const menuIconStyles = (theme?: any) => css`
  cursor: pointer;
  margin: 0;
  padding: ${getSpacing(theme, 'sm')};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${getRadius(theme, 'sm')};
  transition: all ${theme?.animation?.duration?.fast || '150ms'} ${theme?.animation?.easing?.ease || 'ease'};
  
  &:hover {
    background: ${getColor(theme, 'background.tertiary')};
  }
`;

/**
 * Generates styles for menu content container
 * 
 * @param theme - Enhanced theme object
 * @param styleProps - Style properties for customization
 * @returns CSS object for styled component
 */
export const menuContentStyles = (theme?: any, styleProps?: IMenuListStyleProps) => css`
  position: ${styleProps?.position || 'absolute'};
  width: ${styleProps?.width || '200px'};
  font-size: ${styleProps?.fontSize || 'inherit'};
  font-weight: ${styleProps?.fontWeight || 'inherit'};
  border-radius: ${styleProps?.radius || getRadius(theme, 'md')};
  background: ${getColor(theme, 'background.primary')};
  border: ${getBorderWidth(theme, 'sm')} solid ${getColor(theme, 'border.medium')};
  box-shadow: ${getShadow(theme, 'md')};
  z-index: 1000;
  display: ${styleProps?.display || 'none'};
  
  // Responsive design
  @media (max-width: ${getBreakpoint(theme, 'sm')}) {
    width: ${styleProps?.width || '180px'};
    font-size: ${theme?.typography?.fontSize?.sm || '14px'};
  }
`;
