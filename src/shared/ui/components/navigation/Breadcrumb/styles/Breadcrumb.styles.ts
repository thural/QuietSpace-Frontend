/**
 * Breadcrumb Component Styles
 * 
 * Enterprise-grade Emotion CSS styles for the Breadcrumb component
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
 * Base container styles for breadcrumb navigation
 */
export const breadcrumbContainerStyles = (theme?: any) => css`
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${getSpacing(theme, 'sm')} 0;
`;

/**
 * Navigation list styles
 */
export const breadcrumbNavStyles = (theme?: any) => css`
  display: flex;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
`;

/**
 * Breadcrumb list (ordered list) styles
 */
export const breadcrumbListStyles = (theme?: any) => css`
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  flex-wrap: wrap;
`;

/**
 * Individual breadcrumb item styles
 */
export const breadcrumbItemStyles = (
  theme?: any,
  size: 'small' | 'medium' | 'large' = 'medium',
  isActive: boolean = false,
  isDisabled: boolean = false,
  isTruncated: boolean = false
) => css`
  display: flex;
  align-items: center;
  color: ${isDisabled ? 
    getColor(theme, 'text.disabled') : 
    isActive ? 
      getColor(theme, 'text.primary') : 
      getColor(theme, 'text.secondary')};
  font-size: ${getBreadcrumbFontSize(theme, size)};
  font-weight: ${isActive ? 
    getTypography(theme, 'fontWeight.medium') : 
    getTypography(theme, 'fontWeight.normal')};
  text-decoration: none;
  transition: ${getTransition(theme, 'all', 'fast', 'ease')};
  cursor: ${isDisabled ? 'not-allowed' : 'pointer'};
  opacity: ${isDisabled ? '0.6' : '1'};

  &:hover:not(:disabled) {
    color: ${getColor(theme, 'brand.500')};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 ${getSpacing(theme, '2')} ${getColor(theme, 'brand.200')};
  }
`;

/**
 * Breadcrumb link styles
 */
export const breadcrumbLinkStyles = (
  theme?: any,
  size: 'small' | 'medium' | 'large' = 'medium',
  isActive: boolean = false
) => css`
  display: flex;
  align-items: center;
  color: ${isActive ? 
    getColor(theme, 'text.primary') : 
    getColor(theme, 'brand.500')};
  font-size: ${getBreadcrumbFontSize(theme, size)};
  font-weight: ${isActive ? 
    getTypography(theme, 'fontWeight.medium') : 
    getTypography(theme, 'fontWeight.normal')};
  text-decoration: none;
  transition: ${getTransition(theme, 'all', 'fast', 'ease')};
  cursor: pointer;
  border-radius: ${getRadius(theme, 'sm')};
  padding: ${getSpacing(theme, 'xs')} ${getSpacing(theme, 'sm')};

  &:hover {
    color: ${getColor(theme, 'brand.600')};
    background-color: ${getColor(theme, 'background.secondary')};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 ${getSpacing(theme, '2')} ${getColor(theme, 'brand.200')};
  }
`;

/**
 * Breadcrumb text styles (non-clickable items)
 */
export const breadcrumbTextStyles = (
  theme?: any,
  size: 'small' | 'medium' | 'large' = 'medium',
  isActive: boolean = false
) => css`
  display: flex;
  align-items: center;
  color: ${isActive ? 
    getColor(theme, 'text.primary') : 
    getColor(theme, 'text.secondary')};
  font-size: ${getBreadcrumbFontSize(theme, size)};
  font-weight: ${isActive ? 
    getTypography(theme, 'fontWeight.medium') : 
    getTypography(theme, 'fontWeight.normal')};
`;

/**
 * Breadcrumb separator styles
 */
export const breadcrumbSeparatorStyles = (theme?: any) => css`
  display: flex;
  align-items: center;
  margin: 0 ${getSpacing(theme, 'sm')};
  color: ${getColor(theme, 'text.tertiary')};
  font-size: ${getTypography(theme, 'fontSize.sm')};
  user-select: none;
`;

/**
 * Breadcrumb icon styles
 */
export const breadcrumbIconStyles = (theme?: any) => css`
  display: flex;
  align-items: center;
  margin-right: ${getSpacing(theme, 'xs')};
  font-size: ${getTypography(theme, 'fontSize.sm')};
`;

/**
 * Truncated items indicator styles
 */
export const breadcrumbTruncatedStyles = (
  theme?: any,
  size: 'small' | 'medium' | 'large' = 'medium'
) => css`
  display: flex;
  align-items: center;
  color: ${getColor(theme, 'text.tertiary')};
  font-size: ${getBreadcrumbFontSize(theme, size)};
  font-style: italic;
  margin: 0 ${getSpacing(theme, 'xs')};
`;

/**
 * Get font size based on breadcrumb size
 */
const getBreadcrumbFontSize = (
  theme?: any,
  size: 'small' | 'medium' | 'large' = 'medium'
) => {
  const fontSizes = {
    small: getTypography(theme, 'fontSize.sm'),
    medium: getTypography(theme, 'fontSize.base'),
    large: getTypography(theme, 'fontSize.lg')
  };
  return fontSizes[size] || fontSizes.medium;
};

/**
 * Responsive styles for mobile devices
 */
export const breadcrumbResponsiveStyles = (theme?: any) => css`
  @media (max-width: ${getTypography(theme, 'breakpoints.sm')}) {
    ${breadcrumbListStyles(theme)} {
      flex-direction: column;
      align-items: flex-start;
      gap: ${getSpacing(theme, 'xs')};
    }
    
    ${breadcrumbItemStyles(theme, 'medium', false, false, false)} {
      font-size: ${getBreadcrumbFontSize(theme, 'small')};
    }
    
    ${breadcrumbSeparatorStyles(theme)} {
      display: none;
    }
  }
`;

/**
 * Compact variant styles
 */
export const breadcrumbCompactStyles = (theme?: any) => css`
  ${breadcrumbItemStyles(theme, 'medium', false, false, false)} {
    padding: 0;
    font-size: ${getBreadcrumbFontSize(theme, 'small')};
  }
  
  ${breadcrumbSeparatorStyles(theme)} {
    margin: 0 ${getSpacing(theme, 'xs')};
  }
`;
