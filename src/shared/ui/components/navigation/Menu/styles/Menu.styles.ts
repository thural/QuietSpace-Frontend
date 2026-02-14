/**
 * Menu Component Styles
 * 
 * Enterprise-grade Emotion CSS styles for the Menu component
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
 * Base container styles for menu
 */
export const menuContainerStyles = (
  theme?: any,
  mode: 'vertical' | 'horizontal' | 'inline' = 'vertical',
  size: 'small' | 'medium' | 'large' = 'medium',
  menuTheme: 'light' | 'dark' = 'light'
) => css`
  display: flex;
  flex-direction: ${mode === 'horizontal' ? 'row' : 'column'};
  background-color: ${menuTheme === 'dark' ? 
    getColor(theme, 'background.inverse') : 
    getColor(theme, 'background.primary')};
  border: ${getSpacing(theme, 'border.width.sm')} solid ${getColor(theme, 'border.light')};
  border-radius: ${getRadius(theme, 'md')};
  padding: ${getMenuPadding(theme, size)};
  min-width: ${mode === 'horizontal' ? 'auto' : '200px'};
  box-shadow: ${mode === 'horizontal' ? 'none' : 
    `0 ${getSpacing(theme, 'sm')} ${getSpacing(theme, 'md')} ${getColor(theme, 'shadow.light')}`};
`;

/**
 * Get menu padding based on size
 */
const getMenuPadding = (
  theme?: any,
  size: 'small' | 'medium' | 'large'
) => {
  const paddingMap = {
    small: getSpacing(theme, 'sm'),
    medium: getSpacing(theme, 'md'),
    large: getSpacing(theme, 'lg')
  };
  return paddingMap[size] || paddingMap.medium;
};

/**
 * Individual menu item styles
 */
export const menuItemStyles = (
  theme?: any,
  mode: 'vertical' | 'horizontal' | 'inline' = 'vertical',
  size: 'small' | 'medium' | 'large' = 'medium',
  isSelected: boolean = false,
  isDisabled: boolean = false,
  level: number = 0
) => css`
  display: flex;
  align-items: center;
  padding: ${getMenuItemPadding(theme, size)};
  margin: ${getMenuItemMargin(theme, mode, size)};
  color: ${getMenuItemColor(theme, isSelected, isDisabled)};
  background-color: ${getMenuItemBackground(theme, isSelected, isDisabled)};
  border: none;
  border-radius: ${getRadius(theme, 'sm')};
  cursor: ${isDisabled ? 'not-allowed' : 'pointer'};
  font-size: ${getMenuItemFontSize(theme, size)};
  font-weight: ${isSelected ? 
    getTypography(theme, 'fontWeight.medium') : 
    getTypography(theme, 'fontWeight.normal')};
  text-decoration: none;
  transition: ${getTransition(theme, 'all', 'fast', 'ease')};
  position: relative;
  white-space: nowrap;
  user-select: none;
  opacity: ${isDisabled ? '0.6' : '1'};
  padding-left: ${level > 0 ? `${level * 20}px` : getMenuItemPadding(theme, size).split(' ')[0]};

  &:hover:not(:disabled) {
    background-color: ${getMenuItemHoverBackground(theme, isSelected)};
    color: ${getMenuItemHoverColor(theme, isSelected)};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 ${getSpacing(theme, '2')} ${getColor(theme, 'brand.200')};
  }
`;

/**
 * Get menu item padding based on size
 */
const getMenuItemPadding = (
  theme?: any,
  size: 'small' | 'medium' | 'large'
) => {
  const paddingMap = {
    small: `${getSpacing(theme, 'xs')} ${getSpacing(theme, 'sm')}`,
    medium: `${getSpacing(theme, 'sm')} ${getSpacing(theme, 'md')}`,
    large: `${getSpacing(theme, 'md')} ${getSpacing(theme, 'lg')}`
  };
  return paddingMap[size] || paddingMap.medium;
};

/**
 * Get menu item margin based on mode and size
 */
const getMenuItemMargin = (
  theme?: any,
  mode: 'vertical' | 'horizontal' | 'inline',
  size: 'small' | 'medium' | 'large'
) => {
  if (mode === 'horizontal') {
    return `0 ${getSpacing(theme, 'xs')} 0 0`;
  }
  return `0 0 ${getSpacing(theme, 'xs')} 0`;
};

/**
 * Get menu item color based on state
 */
const getMenuItemColor = (
  theme?: any,
  isSelected: boolean,
  isDisabled: boolean
) => {
  if (isDisabled) {
    return getColor(theme, 'text.disabled');
  }
  if (isSelected) {
    return getColor(theme, 'brand.500');
  }
  return getColor(theme, 'text.primary');
};

/**
 * Get menu item background based on state
 */
const getMenuItemBackground = (
  theme?: any,
  isSelected: boolean,
  isDisabled: boolean
) => {
  if (isDisabled) {
    return 'transparent';
  }
  if (isSelected) {
    return getColor(theme, 'brand.50');
  }
  return 'transparent';
};

/**
 * Get menu item hover background
 */
const getMenuItemHoverBackground = (theme?: any, isSelected: boolean) => {
  if (isSelected) {
    return getColor(theme, 'brand.100');
  }
  return getColor(theme, 'background.secondary');
};

/**
 * Get menu item hover color
 */
const getMenuItemHoverColor = (theme?: any, isSelected: boolean) => {
  if (isSelected) {
    return getColor(theme, 'brand.600');
  }
  return getColor(theme, 'text.primary');
};

/**
 * Get menu item font size based on size
 */
const getMenuItemFontSize = (
  theme?: any,
  size: 'small' | 'medium' | 'large'
) => {
  const fontSizes = {
    small: getTypography(theme, 'fontSize.sm'),
    medium: getTypography(theme, 'fontSize.base'),
    large: getTypography(theme, 'fontSize.lg')
  };
  return fontSizes[size] || fontSizes.medium;
};

/**
 * Menu icon styles
 */
export const menuIconStyles = (
  theme?: any,
  size: 'small' | 'medium' | 'large' = 'medium'
) => css`
  display: flex;
  align-items: center;
  margin-right: ${getSpacing(theme, 'sm')};
  font-size: ${getMenuIconFontSize(theme, size)};
  color: inherit;
`;

/**
 * Get menu icon font size based on size
 */
const getMenuIconFontSize = (
  theme?: any,
  size: 'small' | 'medium' | 'large'
) => {
  const iconSizes = {
    small: getTypography(theme, 'fontSize.sm'),
    medium: getTypography(theme, 'fontSize.base'),
    large: getTypography(theme, 'fontSize.lg')
  };
  return iconSizes[size] || iconSizes.medium;
};

/**
 * Menu label styles
 */
export const menuLabelStyles = (
  theme?: any,
  size: 'small' | 'medium' | 'large' = 'medium'
) => css`
  flex: 1;
  font-size: ${getMenuItemFontSize(theme, size)};
  color: inherit;
`;

/**
 * Menu arrow/submenu indicator styles
 */
export const menuArrowStyles = (
  theme?: any,
  size: 'small' | 'medium' | 'large' = 'medium',
  isOpen: boolean = false
) => css`
  margin-left: auto;
  font-size: ${getMenuIconFontSize(theme, size)};
  color: ${getColor(theme, 'text.tertiary')};
  transition: ${getTransition(theme, 'transform', 'fast', 'ease')};
  transform: ${isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

/**
 * Menu divider styles
 */
export const menuDividerStyles = (
  theme?: any,
  mode: 'vertical' | 'horizontal' | 'inline' = 'vertical'
) => css`
  height: ${mode === 'horizontal' ? 'auto' : getSpacing(theme, 'border.width.sm')};
  width: ${mode === 'horizontal' ? getSpacing(theme, 'border.width.sm') : 'auto'};
  background-color: ${getColor(theme, 'border.light')};
  margin: ${getSpacing(theme, 'xs')} 0;
`;

/**
 * Menu group styles
 */
export const menuGroupStyles = (
  theme?: any,
  mode: 'vertical' | 'horizontal' | 'inline' = 'vertical'
) => css`
  display: flex;
  flex-direction: ${mode === 'horizontal' ? 'row' : 'column'};
  margin: ${getSpacing(theme, 'sm')} 0;
`;

/**
 * Menu group title styles
 */
export const menuGroupTitleStyles = (
  theme?: any,
  size: 'small' | 'medium' | 'large' = 'medium'
) => css`
  padding: ${getMenuItemPadding(theme, size)};
  font-size: ${getMenuItemFontSize(theme, size)};
  font-weight: ${getTypography(theme, 'fontWeight.medium')};
  color: ${getColor(theme, 'text.secondary')};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

/**
 * Submenu styles
 */
export const submenuStyles = (
  theme?: any,
  mode: 'vertical' | 'horizontal' | 'inline' = 'vertical'
) => css`
  position: absolute;
  top: 0;
  left: 100%;
  background-color: ${getColor(theme, 'background.primary')};
  border: ${getSpacing(theme, 'border.width.sm')} solid ${getColor(theme, 'border.light')};
  border-radius: ${getRadius(theme, 'md')};
  box-shadow: `0 ${getSpacing(theme, 'sm')} ${getSpacing(theme, 'md')} ${getColor(theme, 'shadow.light')}`;
  z-index: 1000;
  min-width: 200px;
  ${mode === 'horizontal' ? css`
    top: 100%;
    left: 0;
  ` : ''}
`;

/**
 * Responsive styles for mobile devices
 */
export const menuResponsiveStyles = (theme?: any) => css`
  @media (max-width: ${getTypography(theme, 'breakpoints.sm')}) {
    ${menuContainerStyles(theme, 'vertical', 'medium', 'light')} {
      width: 100%;
      min-width: auto;
    }
    
    ${menuItemStyles(theme, 'vertical', 'medium', false, false, 0)} {
      padding: ${getMenuItemPadding(theme, 'small')};
      font-size: ${getMenuItemFontSize(theme, 'small')};
    }
  }
`;
