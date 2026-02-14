/**
 * TabNavigation Component Styles
 * 
 * Enterprise-grade Emotion CSS styles for the TabNavigation component
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
 * Base container styles for tab navigation
 */
export const tabNavigationContainerStyles = (theme?: any) => css`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

/**
 * Styles for tab list container
 */
export const tabListStyles = (
  theme?: any,
  variant: 'default' | 'pills' | 'cards' = 'default',
  orientation: 'horizontal' | 'vertical' = 'horizontal'
) => css`
  display: flex;
  flex-direction: ${orientation === 'vertical' ? 'column' : 'row'};
  gap: ${getTabListGap(theme, variant, orientation)};
  border-bottom: ${variant === 'default' && orientation === 'horizontal' ? 
    `${getSpacing(theme, 'border.width.sm')} solid ${getColor(theme, 'border.light')}` : 
    'none'};
  border-right: ${variant === 'default' && orientation === 'vertical' ? 
    `${getSpacing(theme, 'border.width.sm')} solid ${getColor(theme, 'border.light')}` : 
    'none'};
  margin-bottom: ${orientation === 'horizontal' ? getSpacing(theme, 'md') : '0'};
  margin-right: ${orientation === 'vertical' ? getSpacing(theme, 'md') : '0'};
`;

/**
 * Get gap styles based on variant and orientation
 */
const getTabListGap = (
  theme?: any,
  variant: 'default' | 'pills' | 'cards' = 'default',
  orientation: 'horizontal' | 'vertical' = 'horizontal'
) => {
  const gaps = {
    default: orientation === 'vertical' ? getSpacing(theme, 'sm') : getSpacing(theme, 'sm'),
    pills: orientation === 'vertical' ? getSpacing(theme, 'md') : getSpacing(theme, 'md'),
    cards: orientation === 'vertical' ? getSpacing(theme, 'lg') : getSpacing(theme, 'lg')
  };
  return gaps[variant];
};

/**
 * Styles for individual tab buttons
 */
export const tabButtonStyles = (
  theme?: any,
  isActive: boolean = false,
  variant: 'default' | 'pills' | 'cards' = 'default',
  size: 'sm' | 'md' | 'lg' = 'md',
  orientation: 'horizontal' | 'vertical' = 'horizontal',
  disabled: boolean = false
) => css`
  background: ${getTabBackground(theme, isActive, variant)};
  color: ${getTabColor(theme, isActive, variant)};
  border: ${getTabBorder(theme, isActive, variant, orientation)};
  padding: ${getTabPadding(theme, size, orientation)};
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  font-size: ${getTabFontSize(theme, size)};
  font-weight: ${getTypography(theme, 'fontWeight.medium')};
  border-radius: ${getTabBorderRadius(theme, variant, orientation)};
  transition: ${getTransition(theme, 'all', 'fast', 'ease')};
  display: flex;
  align-items: center;
  gap: ${getSpacing(theme, 'sm')};
  position: relative;
  white-space: nowrap;
  user-select: none;
  opacity: ${disabled ? '0.6' : '1'};

  &:hover:not(:disabled) {
    background: ${getTabHoverBackground(theme, isActive, variant)};
    border-color: ${getTabHoverBorder(theme, isActive, variant)};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 ${getSpacing(theme, '2')} ${getColor(theme, 'brand.200')};
  }
`;

/**
 * Get tab background based on state and variant
 */
const getTabBackground = (
  theme?: any,
  isActive: boolean,
  variant: 'default' | 'pills' | 'cards'
) => {
  if (variant === 'default') {
    return isActive ? getColor(theme, 'brand.500') : getColor(theme, 'background.secondary');
  } else if (variant === 'pills') {
    return isActive ? getColor(theme, 'brand.500') : 'transparent';
  } else if (variant === 'cards') {
    return isActive ? getColor(theme, 'background.primary') : getColor(theme, 'background.tertiary');
  }
  return getColor(theme, 'background.secondary');
};

/**
 * Get tab color based on state and variant
 */
const getTabColor = (
  theme?: any,
  isActive: boolean,
  variant: 'default' | 'pills' | 'cards'
) => {
  if (variant === 'default' || variant === 'pills') {
    return isActive ? getColor(theme, 'text.inverse') : getColor(theme, 'text.primary');
  } else if (variant === 'cards') {
    return isActive ? getColor(theme, 'brand.500') : getColor(theme, 'text.primary');
  }
  return getColor(theme, 'text.primary');
};

/**
 * Get tab border based on state and variant
 */
const getTabBorder = (
  theme?: any,
  isActive: boolean,
  variant: 'default' | 'pills' | 'cards',
  orientation: 'horizontal' | 'vertical'
) => {
  if (variant === 'default') {
    return `${getSpacing(theme, 'border.width.md')} solid ${isActive ? 
      getColor(theme, 'brand.500') : 'transparent'}`;
  } else if (variant === 'pills') {
    return 'none';
  } else if (variant === 'cards') {
    return `${getSpacing(theme, 'border.width.sm')} solid ${isActive ? 
      getColor(theme, 'brand.500') : getColor(theme, 'border.light')}`;
  }
  return 'none';
};

/**
 * Get tab hover background
 */
const getTabHoverBackground = (
  theme?: any,
  isActive: boolean,
  variant: 'default' | 'pills' | 'cards'
) => {
  if (variant === 'default') {
    return isActive ? getColor(theme, 'brand.500') : getColor(theme, 'background.tertiary');
  } else if (variant === 'pills') {
    return isActive ? getColor(theme, 'brand.500') : getColor(theme, 'background.tertiary');
  } else if (variant === 'cards') {
    return isActive ? getColor(theme, 'background.primary') : getColor(theme, 'background.secondary');
  }
  return getColor(theme, 'background.tertiary');
};

/**
 * Get tab hover border
 */
const getTabHoverBorder = (
  theme?: any,
  isActive: boolean,
  variant: 'default' | 'pills' | 'cards'
) => {
  if (variant === 'default') {
    return isActive ? getColor(theme, 'brand.500') : getColor(theme, 'border.light');
  } else if (variant === 'pills') {
    return 'none';
  } else if (variant === 'cards') {
    return isActive ? getColor(theme, 'brand.500') : getColor(theme, 'border.medium');
  }
  return getColor(theme, 'border.light');
};

/**
 * Get tab padding based on size and orientation
 */
const getTabPadding = (
  theme?: any,
  size: 'sm' | 'md' | 'lg',
  orientation: 'horizontal' | 'vertical'
) => {
  const paddingMap = {
    horizontal: {
      sm: `${getSpacing(theme, 'xs')} ${getSpacing(theme, 'sm')}`,
      md: `${getSpacing(theme, 'sm')} ${getSpacing(theme, 'md')}`,
      lg: `${getSpacing(theme, 'md')} ${getSpacing(theme, 'lg')}`
    },
    vertical: {
      sm: `${getSpacing(theme, 'sm')} ${getSpacing(theme, 'xs')}`,
      md: `${getSpacing(theme, 'md')} ${getSpacing(theme, 'sm')}`,
      lg: `${getSpacing(theme, 'lg')} ${getSpacing(theme, 'md')}`
    }
  };
  return paddingMap[orientation]?.[size] || paddingMap.horizontal.md;
};

/**
 * Get tab font size based on size
 */
const getTabFontSize = (theme?: any, size: 'sm' | 'md' | 'lg') => {
  const fontSizes = {
    sm: getTypography(theme, 'fontSize.sm'),
    md: getTypography(theme, 'fontSize.base'),
    lg: getTypography(theme, 'fontSize.lg')
  };
  return fontSizes[size] || fontSizes.md;
};

/**
 * Get tab border radius based on variant and orientation
 */
const getTabBorderRadius = (
  theme?: any,
  variant: 'default' | 'pills' | 'cards',
  orientation: 'horizontal' | 'vertical'
) => {
  if (variant === 'pills') {
    return getRadius(theme, 'lg');
  } else if (variant === 'cards') {
    return getRadius(theme, 'md');
  }
  return orientation === 'horizontal' ? 
    `${getRadius(theme, 'md')} ${getRadius(theme, 'md')} 0 0` : 
    `0 0 ${getRadius(theme, 'md')} ${getRadius(theme, 'md')}`;
};

/**
 * Styles for tab content container
 */
export const tabContentContainerStyles = (
  theme?: any,
  orientation: 'horizontal' | 'vertical' = 'horizontal'
) => css`
  margin-top: ${orientation === 'horizontal' ? getSpacing(theme, 'lg') : '0'};
  margin-left: ${orientation === 'vertical' ? getSpacing(theme, 'lg') : '0'};
  position: relative;
  min-height: 200px;
`;

/**
 * Styles for tab panel content
 */
export const tabPanelStyles = (
  theme?: any,
  isTransitioning: boolean = false
) => css`
  opacity: ${isTransitioning ? '0' : '1'};
  transition: ${getTransition(theme, 'opacity', 'fast', 'ease')};
  animation: ${isTransitioning ? 'none' : `${tabPanelFadeIn} ${getTransition(theme, 'duration', 'fast')}ms ${getTransition(theme, 'easing', 'ease')}`};
`;

/**
 * Keyframe animation for tab panel fade-in
 */
const tabPanelFadeIn = css`
  @keyframes tabPanelFadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

/**
 * Badge styles for tab notifications
 */
export const tabBadgeStyles = (theme?: any) => css`
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
export const tabNavigationResponsiveStyles = (theme?: any) => css`
  @media (max-width: ${getTypography(theme, 'breakpoints.sm')}) {
    ${tabListStyles(theme, 'default', 'horizontal')} {
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
      
      &::-webkit-scrollbar {
        display: none;
      }
    }
    
    ${tabButtonStyles(theme, false, 'default', 'md', 'horizontal', false)} {
      padding: ${getSpacing(theme, 'xs')} ${getSpacing(theme, 'md')};
      font-size: ${getTabFontSize(theme, 'sm')};
      min-width: fit-content;
    }
  }
`;
