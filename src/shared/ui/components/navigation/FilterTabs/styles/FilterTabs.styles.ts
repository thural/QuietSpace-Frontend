/**
 * FilterTabs Component Styles
 * 
 * Enterprise-grade Emotion CSS styles for the FilterTabs component
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
 * Base container styles for filter tabs
 */
export const filterTabsContainerStyles = (
  theme?: any,
  variant: 'default' | 'pills' | 'underline' = 'default',
  fullWidth: boolean = false
) => css`
  display: flex;
  align-items: center;
  gap: ${getFilterTabsGap(theme, variant)};
  border-bottom: ${variant === 'underline' ? 
    `${getSpacing(theme, 'border.width.sm')} solid ${getColor(theme, 'border.light')}` : 
    'none'};
  width: ${fullWidth ? '100%' : 'fit-content'};
`;

/**
 * Get gap styles based on variant
 */
const getFilterTabsGap = (
  theme?: any,
  variant: 'default' | 'pills' | 'underline' = 'default'
) => {
  const gaps = {
    default: getSpacing(theme, 'sm'),
    pills: getSpacing(theme, 'md'),
    underline: getSpacing(theme, 'lg')
  };
  return gaps[variant];
};

/**
 * Individual filter tab button styles
 */
export const filterTabButtonStyles = (
  theme?: any,
  isActive: boolean = false,
  variant: 'default' | 'pills' | 'underline' = 'default',
  size: 'sm' | 'md' | 'lg' = 'md',
  disabled: boolean = false,
  fullWidth: boolean = false
) => css`
  background: ${getFilterTabBackground(theme, isActive, variant)};
  color: ${getFilterTabColor(theme, isActive, variant)};
  border: ${getFilterTabBorder(theme, isActive, variant)};
  padding: ${getFilterTabPadding(theme, size)};
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  font-size: ${getFilterTabFontSize(theme, size)};
  font-weight: ${getTypography(theme, 'fontWeight.medium')};
  border-radius: ${getFilterTabBorderRadius(theme, variant)};
  transition: ${getTransition(theme, 'all', 'fast', 'ease')};
  display: flex;
  align-items: center;
  gap: ${getSpacing(theme, 'sm')};
  position: relative;
  white-space: nowrap;
  user-select: none;
  opacity: ${disabled ? '0.6' : '1'};
  flex: ${fullWidth ? '1' : '0'};

  &:hover:not(:disabled) {
    background: ${getFilterTabHoverBackground(theme, isActive, variant)};
    border-color: ${getFilterTabHoverBorder(theme, isActive, variant)};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 ${getSpacing(theme, '2')} ${getColor(theme, 'brand.200')};
  }
`;

/**
 * Get tab background based on state and variant
 */
const getFilterTabBackground = (
  theme?: any,
  isActive: boolean,
  variant: 'default' | 'pills' | 'underline'
) => {
  if (variant === 'default') {
    return isActive ? getColor(theme, 'brand.500') : getColor(theme, 'background.secondary');
  } else if (variant === 'pills') {
    return isActive ? getColor(theme, 'brand.500') : getColor(theme, 'background.secondary');
  } else if (variant === 'underline') {
    return 'transparent';
  }
  return getColor(theme, 'background.secondary');
};

/**
 * Get tab color based on state and variant
 */
const getFilterTabColor = (
  theme?: any,
  isActive: boolean,
  variant: 'default' | 'pills' | 'underline'
) => {
  if (variant === 'default' || variant === 'pills') {
    return isActive ? getColor(theme, 'text.inverse') : getColor(theme, 'text.primary');
  } else if (variant === 'underline') {
    return isActive ? getColor(theme, 'brand.500') : getColor(theme, 'text.secondary');
  }
  return getColor(theme, 'text.primary');
};

/**
 * Get tab border based on state and variant
 */
const getFilterTabBorder = (
  theme?: any,
  isActive: boolean,
  variant: 'default' | 'pills' | 'underline'
) => {
  if (variant === 'default') {
    return 'none';
  } else if (variant === 'pills') {
    return 'none';
  } else if (variant === 'underline') {
    return `${getSpacing(theme, 'border.width.sm')} solid ${isActive ? 
      getColor(theme, 'brand.500') : 'transparent'}`;
  }
  return 'none';
};

/**
 * Get tab hover background
 */
const getFilterTabHoverBackground = (
  theme?: any,
  isActive: boolean,
  variant: 'default' | 'pills' | 'underline'
) => {
  if (variant === 'default') {
    return isActive ? getColor(theme, 'brand.500') : getColor(theme, 'background.tertiary');
  } else if (variant === 'pills') {
    return isActive ? getColor(theme, 'brand.500') : getColor(theme, 'background.tertiary');
  } else if (variant === 'underline') {
    return 'transparent';
  }
  return getColor(theme, 'background.tertiary');
};

/**
 * Get tab hover border
 */
const getFilterTabHoverBorder = (
  theme?: any,
  isActive: boolean,
  variant: 'default' | 'pills' | 'underline'
) => {
  if (variant === 'default') {
    return 'none';
  } else if (variant === 'pills') {
    return 'none';
  } else if (variant === 'underline') {
    return `${getSpacing(theme, 'border.width.sm')} solid ${isActive ? 
      getColor(theme, 'brand.500') : getColor(theme, 'border.light')}`;
  }
  return 'none';
};

/**
 * Get tab padding based on size
 */
const getFilterTabPadding = (
  theme?: any,
  size: 'sm' | 'md' | 'lg'
) => {
  const paddingMap = {
    sm: `${getSpacing(theme, 'xs')} ${getSpacing(theme, 'sm')}`,
    md: `${getSpacing(theme, 'sm')} ${getSpacing(theme, 'md')}`,
    lg: `${getSpacing(theme, 'md')} ${getSpacing(theme, 'lg')}`
  };
  return paddingMap[size] || paddingMap.md;
};

/**
 * Get tab font size based on size
 */
const getFilterTabFontSize = (
  theme?: any,
  size: 'sm' | 'md' | 'lg'
) => {
  const fontSizes = {
    sm: getTypography(theme, 'fontSize.sm'),
    md: getTypography(theme, 'fontSize.base'),
    lg: getTypography(theme, 'fontSize.lg')
  };
  return fontSizes[size] || fontSizes.md;
};

/**
 * Get tab border radius based on variant
 */
const getFilterTabBorderRadius = (
  theme?: any,
  variant: 'default' | 'pills' | 'underline'
) => {
  if (variant === 'pills') {
    return getRadius(theme, 'lg');
  } else if (variant === 'underline') {
    return '0';
  }
  return getRadius(theme, 'sm');
};

/**
 * Badge styles for tab notifications
 */
export const filterTabBadgeStyles = (theme?: any) => css`
  margin-left: ${getSpacing(theme, 'sm')};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 ${getSpacing(theme, 'xs')};
  border-radius: ${getRadius(theme, 'lg')};
  background-color: ${getColor(theme, 'error.500')};
  color: ${getColor(theme, 'text.inverse')};
  font-size: ${getTypography(theme, 'fontSize.xs')};
  font-weight: ${getTypography(theme, 'fontWeight.medium')};
  line-height: 1;
`;

/**
 * Responsive styles for mobile devices
 */
export const filterTabsResponsiveStyles = (theme?: any) => css`
  @media (max-width: ${getTypography(theme, 'breakpoints.sm')}) {
    ${filterTabsContainerStyles(theme, 'default', false)} {
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
      
      &::-webkit-scrollbar {
        display: none;
      }
    }
    
    ${filterTabButtonStyles(theme, false, 'default', 'md', false, false)} {
      padding: ${getFilterTabPadding(theme, 'sm')};
      font-size: ${getFilterTabFontSize(theme, 'sm')};
      min-width: fit-content;
    }
  }
`;
