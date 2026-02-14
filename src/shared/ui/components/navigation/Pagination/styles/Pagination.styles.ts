/**
 * Pagination Component Styles
 * 
 * Enterprise-grade Emotion CSS styles for the Pagination component
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
 * Base container styles for pagination
 */
export const paginationContainerStyles = (
  theme?: any,
  size: 'small' | 'medium' | 'large' = 'medium'
) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${getPaginationGap(theme, size)};
  padding: ${getPaginationPadding(theme, size)};
  background-color: ${getColor(theme, 'background.primary')};
  border: ${getSpacing(theme, 'border.width.sm')} solid ${getColor(theme, 'border.light')};
  border-radius: ${getRadius(theme, 'md')};
  box-shadow: `0 ${getSpacing(theme, 'xs')} ${getSpacing(theme, 'sm')} ${getColor(theme, 'shadow.light')}`;
`;

/**
 * Get pagination gap based on size
 */
const getPaginationGap = (
  theme?: any,
  size: 'small' | 'medium' | 'large'
) => {
  const gapMap = {
    small: getSpacing(theme, 'xs'),
    medium: getSpacing(theme, 'sm'),
    large: getSpacing(theme, 'md')
  };
  return gapMap[size] || gapMap.medium;
};

/**
 * Get pagination padding based on size
 */
const getPaginationPadding = (
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
 * Pagination button styles
 */
export const paginationButtonStyles = (
  theme?: any,
  size: 'small' | 'medium' | 'large' = 'medium',
  isDisabled: boolean = false,
  isActive: boolean = false
) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: ${getPaginationButtonSize(theme, size)};
  height: ${getPaginationButtonSize(theme, size)};
  padding: 0 ${getSpacing(theme, 'sm')};
  background-color: ${getPaginationButtonBackground(theme, isActive, isDisabled)};
  color: ${getPaginationButtonColor(theme, isActive, isDisabled)};
  border: ${getSpacing(theme, 'border.width.sm')} solid ${getPaginationButtonBorder(theme, isActive, isDisabled)};
  border-radius: ${getRadius(theme, 'sm')};
  cursor: ${isDisabled ? 'not-allowed' : 'pointer'};
  font-size: ${getPaginationButtonFontSize(theme, size)};
  font-weight: ${getTypography(theme, 'fontWeight.medium')};
  transition: ${getTransition(theme, 'all', 'fast', 'ease')};
  opacity: ${isDisabled ? '0.6' : '1'};

  &:hover:not(:disabled) {
    background-color: ${getPaginationButtonHoverBackground(theme, isActive)};
    border-color: ${getPaginationButtonHoverBorder(theme, isActive)};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 ${getSpacing(theme, '2')} ${getColor(theme, 'brand.200')};
  }
`;

/**
 * Get pagination button size based on size
 */
const getPaginationButtonSize = (
  theme?: any,
  size: 'small' | 'medium' | 'large'
) => {
  const sizeMap = {
    small: '24px',
    medium: '32px',
    large: '40px'
  };
  return sizeMap[size] || sizeMap.medium;
};

/**
 * Get pagination button background based on state
 */
const getPaginationButtonBackground = (
  theme?: any,
  isActive: boolean,
  isDisabled: boolean
) => {
  if (isDisabled) {
    return getColor(theme, 'background.disabled');
  }
  if (isActive) {
    return getColor(theme, 'brand.500');
  }
  return getColor(theme, 'background.primary');
};

/**
 * Get pagination button color based on state
 */
const getPaginationButtonColor = (
  theme?: any,
  isActive: boolean,
  isDisabled: boolean
) => {
  if (isDisabled) {
    return getColor(theme, 'text.disabled');
  }
  if (isActive) {
    return getColor(theme, 'text.inverse');
  }
  return getColor(theme, 'text.primary');
};

/**
 * Get pagination button border based on state
 */
const getPaginationButtonBorder = (
  theme?: any,
  isActive: boolean,
  isDisabled: boolean
) => {
  if (isDisabled) {
    return getColor(theme, 'border.disabled');
  }
  if (isActive) {
    return getColor(theme, 'brand.500');
  }
  return getColor(theme, 'border.light');
};

/**
 * Get pagination button hover background
 */
const getPaginationButtonHoverBackground = (theme?: any, isActive: boolean) => {
  if (isActive) {
    return getColor(theme, 'brand.600');
  }
  return getColor(theme, 'background.secondary');
};

/**
 * Get pagination button hover border
 */
const getPaginationButtonHoverBorder = (theme?: any, isActive: boolean) => {
  if (isActive) {
    return getColor(theme, 'brand.600');
  }
  return getColor(theme, 'border.medium');
};

/**
 * Get pagination button font size based on size
 */
const getPaginationButtonFontSize = (
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
 * Pagination number styles
 */
export const paginationNumberStyles = (
  theme?: any,
  size: 'small' | 'medium' | 'large' = 'medium',
  isActive: boolean = false
) => css`
  ${paginationButtonStyles(theme, size, false, isActive)}
  min-width: ${getPaginationNumberSize(theme, size)};
  font-weight: ${isActive ? 
    getTypography(theme, 'fontWeight.semibold') : 
    getTypography(theme, 'fontWeight.medium')};
`;

/**
 * Get pagination number size based on size
 */
const getPaginationNumberSize = (
  theme?: any,
  size: 'small' | 'medium' | 'large'
) => {
  const sizeMap = {
    small: '28px',
    medium: '36px',
    large: '44px'
  };
  return sizeMap[size] || sizeMap.medium;
};

/**
 * Pagination icon styles
 */
export const paginationIconStyles = (
  theme?: any,
  size: 'small' | 'medium' | 'large' = 'medium'
) => css`
  font-size: ${getPaginationIconSize(theme, size)};
  line-height: 1;
`;

/**
 * Get pagination icon size based on size
 */
const getPaginationIconSize = (
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
 * Pagination total text styles
 */
export const paginationTotalStyles = (
  theme?: any,
  size: 'small' | 'medium' | 'large' = 'medium'
) => css`
  font-size: ${getPaginationTotalFontSize(theme, size)};
  color: ${getColor(theme, 'text.secondary')};
  font-weight: ${getTypography(theme, 'fontWeight.normal')};
  white-space: nowrap;
`;

/**
 * Get pagination total font size based on size
 */
const getPaginationTotalFontSize = (
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
 * Pagination quick jumper styles
 */
export const paginationJumperStyles = (
  theme?: any,
  size: 'small' | 'medium' | 'large' = 'medium'
) => css`
  display: flex;
  align-items: center;
  gap: ${getSpacing(theme, 'xs')};
  font-size: ${getPaginationTotalFontSize(theme, size)};
`;

/**
 * Pagination jumper input styles
 */
export const paginationJumperInputStyles = (
  theme?: any,
  size: 'small' | 'medium' | 'large' = 'medium'
) => css`
  width: ${getPaginationInputWidth(theme, size)};
  height: ${getPaginationInputHeight(theme, size)};
  padding: 0 ${getSpacing(theme, 'xs')};
  border: ${getSpacing(theme, 'border.width.sm')} solid ${getColor(theme, 'border.light')};
  border-radius: ${getRadius(theme, 'sm')};
  font-size: ${getPaginationTotalFontSize(theme, size)};
  text-align: center;
  transition: ${getTransition(theme, 'border-color', 'fast', 'ease')};

  &:focus {
    outline: none;
    border-color: ${getColor(theme, 'brand.500')};
    box-shadow: 0 0 0 ${getSpacing(theme, '2')} ${getColor(theme, 'brand.200')};
  }
`;

/**
 * Get pagination input width based on size
 */
const getPaginationInputWidth = (
  theme?: any,
  size: 'small' | 'medium' | 'large'
) => {
  const widthMap = {
    small: '48px',
    medium: '60px',
    large: '72px'
  };
  return widthMap[size] || widthMap.medium;
};

/**
 * Get pagination input height based on size
 */
const getPaginationInputHeight = (
  theme?: any,
  size: 'small' | 'medium' | 'large'
) => {
  const heightMap = {
    small: '24px',
    medium: '32px',
    large: '40px'
  };
  return heightMap[size] || heightMap.medium;
};

/**
 * Pagination size changer styles
 */
export const paginationSizerStyles = (
  theme?: any,
  size: 'small' | 'medium' | 'large' = 'medium'
) => css`
  display: flex;
  align-items: center;
`;

/**
 * Pagination size changer select styles
 */
export const paginationSizerSelectStyles = (
  theme?: any,
  size: 'small' | 'medium' | 'large' = 'medium'
) => css`
  height: ${getPaginationInputHeight(theme, size)};
  padding: 0 ${getSpacing(theme, 'sm')};
  border: ${getSpacing(theme, 'border.width.sm')} solid ${getColor(theme, 'border.light')};
  border-radius: ${getRadius(theme, 'sm')};
  font-size: ${getPaginationTotalFontSize(theme, size)};
  background-color: ${getColor(theme, 'background.primary')};
  transition: ${getTransition(theme, 'border-color', 'fast', 'ease')};

  &:focus {
    outline: none;
    border-color: ${getColor(theme, 'brand.500')};
    box-shadow: 0 0 0 ${getSpacing(theme, '2')} ${getColor(theme, 'brand.200')};
  }
`;

/**
 * Responsive styles for mobile devices
 */
export const paginationResponsiveStyles = (theme?: any) => css`
  @media (max-width: ${getTypography(theme, 'breakpoints.sm')}) {
    ${paginationContainerStyles(theme, 'medium')} {
      flex-wrap: wrap;
      gap: ${getSpacing(theme, 'xs')};
    }
    
    ${paginationButtonStyles(theme, 'medium', false, false)} {
      min-width: ${getPaginationButtonSize(theme, 'small')};
      height: ${getPaginationButtonSize(theme, 'small')};
      font-size: ${getPaginationButtonFontSize(theme, 'small')};
    }
    
    ${paginationNumberStyles(theme, 'medium', false)} {
      min-width: ${getPaginationNumberSize(theme, 'small')};
      font-size: ${getPaginationButtonFontSize(theme, 'small')};
    }
  }
`;
