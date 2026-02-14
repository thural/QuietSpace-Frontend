/**
 * FollowToggle Component Styles
 * 
 * Enterprise Emotion CSS styles for the FollowToggle component
 * following theme system patterns and responsive design.
 */

import { css } from '@emotion/react';
import { getSpacing, getColor, getRadius, getTransition, getTypography } from '../../../utils';

/**
 * Generates styles for follow toggle button
 * 
 * @param theme - Enhanced theme object
 * @param isFollowing - Whether user is currently being followed
 * @returns CSS object for styled component
 */
export const followToggleStyles = (theme?: any, isFollowing?: boolean) => css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${getSpacing(theme, 'sm')} ${getSpacing(theme, 'md')};
  border-radius: ${getRadius(theme, 'md')};
  font-size: ${getTypography(theme, 'fontSize.sm')};
  font-weight: ${getTypography(theme, 'fontWeight.medium')};
  border: 1px solid ${isFollowing ? getColor(theme, 'semantic.success') : getColor(theme, 'brand.500')};
  background: ${isFollowing ? getColor(theme, 'semantic.success') : 'transparent'};
  color: ${isFollowing ? getColor(theme, 'text.inverse') : getColor(theme, 'brand.500')};
  cursor: pointer;
  transition: all ${getTransition(theme, 'all', 'fast', 'ease')};
  user-select: none;
  
  &:hover {
    ${isFollowing ? css`
      background: ${getColor(theme, 'semantic.error')};
      border-color: ${getColor(theme, 'semantic.error')};
      color: ${getColor(theme, 'text.inverse')};
    ` : css`
      background: ${getColor(theme, 'brand.500')};
      color: ${getColor(theme, 'text.inverse')};
    `}
    
    transform: translateY(-1px);
    box-shadow: ${getRadius(theme, 'sm')} 0 4px 8px ${getColor(theme, 'shadow.medium')};
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: ${getRadius(theme, 'sm')} 0 2px 4px ${getColor(theme, 'shadow.light')};
  }
  
  &:focus {
    outline: 2px solid ${getColor(theme, 'brand.500')};
    outline-offset: 2px;
  }
  
  // Responsive design
  @media (max-width: ${theme?.breakpoints?.sm || '640px'}) {
    padding: ${getSpacing(theme, 'xs')} ${getSpacing(theme, 'sm')};
    font-size: ${getTypography(theme, 'fontSize.xs')};
  }
`;
