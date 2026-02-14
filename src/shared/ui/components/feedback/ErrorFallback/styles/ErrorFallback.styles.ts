/**
 * ErrorFallback Component Styles
 * 
 * Enterprise-grade error fallback styles using Emotion CSS with
 * theme integration. Includes container, card, buttons, and
 * responsive design.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { css } from '@emotion/react';
import { 
  getSpacing, 
  getColor, 
  getTypography, 
  getRadius, 
  getBorderWidth, 
  getShadow, 
  getTransition 
} from '../../../utils';

/**
 * Error fallback container styles
 */
export const errorFallbackContainerStyles = (theme?: any) => css`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${getColor(theme, 'background.secondary')};
  font-family: ${theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
`;

/**
 * Error card styles
 */
export const errorCardStyles = (theme?: any) => css`
  max-width: 28rem;
  width: 100%;
  padding: ${getSpacing(theme, 'xl')};
  background-color: ${getColor(theme, 'background.primary')};
  border-radius: ${getRadius(theme, 'lg')};
  box-shadow: ${getShadow(theme, 'md')};
`;

/**
 * Error content styles
 */
export const errorContentStyles = () => css`
  text-align: center;
`;

/**
 * Error icon container styles
 */
export const errorIconContainerStyles = (theme?: any) => css`
  margin-bottom: ${getSpacing(theme, 'lg')};
`;

/**
 * Error title styles
 */
export const errorTitleStyles = (theme?: any) => css`
  font-size: ${getTypography(theme, 'fontSize.xl')};
  font-weight: ${theme?.typography?.fontWeight?.semibold || '600'};
  color: ${getColor(theme, 'text.primary')};
  margin-bottom: ${getSpacing(theme, 'sm')};
`;

/**
 * Error message styles
 */
export const errorMessageStyles = (theme?: any) => css`
  font-size: ${getTypography(theme, 'fontSize.base')};
  color: ${getColor(theme, 'text.secondary')};
  margin-bottom: ${getSpacing(theme, 'xl')};
  line-height: ${theme?.typography?.lineHeight?.relaxed || '1.625'};
`;

/**
 * Action buttons container styles
 */
export const actionButtonsContainerStyles = (theme?: any) => css`
  display: flex;
  flex-direction: column;
  gap: ${getSpacing(theme, 'md')};
`;

/**
 * Styled button styles
 */
export const styledButtonStyles = (theme?: any, variant: 'primary' | 'secondary' = 'primary') => css`
  width: 100%;
  padding: ${getSpacing(theme, 'md')} ${getSpacing(theme, 'lg')};
  border: ${getBorderWidth(theme, 'md')} solid ${variant === 'primary'
    ? getColor(theme, 'brand.500')
    : getColor(theme, 'border.medium')};
  background-color: ${variant === 'primary'
    ? getColor(theme, 'brand.500')
    : 'transparent'};
  color: ${variant === 'primary'
    ? getColor(theme, 'text.inverse')
    : getColor(theme, 'brand.500')};
  border-radius: ${getRadius(theme, 'md')};
  font-family: ${theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
  font-size: ${getTypography(theme, 'fontSize.base')};
  font-weight: ${theme?.typography?.fontWeight?.medium || '500'};
  cursor: pointer;
  transition: ${getTransition(theme, 'all', 'fast', 'ease')};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${getShadow(theme, 'md')};
    ${variant === 'primary' && css`
      background-color: ${getColor(theme, 'brand.600')};
      border-color: ${getColor(theme, 'brand.600')};
    `}
    ${variant === 'secondary' && css`
      background-color: ${getColor(theme, 'background.secondary')};
      border-color: ${getColor(theme, 'border.dark')};
      color: ${getColor(theme, 'brand.500')};
    `}
  }
  
  &:focus {
    outline: 2px solid ${getColor(theme, 'brand.300')};
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

/**
 * Error details styles
 */
export const errorDetailsStyles = (theme?: any) => css`
  margin-top: ${getSpacing(theme, 'lg')};
  padding: ${getSpacing(theme, 'md')};
  background-color: ${getColor(theme, 'background.tertiary')};
  border-radius: ${getRadius(theme, 'md')};
  font-family: 'monospace';
  font-size: 12px;
  color: ${getColor(theme, 'text.secondary')};
  text-align: left;
  border: ${getBorderWidth(theme, 'thin')} solid ${getColor(theme, 'border.light')};
`;

/**
 * Error code styles
 */
export const errorCodeStyles = (theme?: any) => css`
  display: inline-block;
  margin-top: ${getSpacing(theme, 'sm')};
  padding: ${getSpacing(theme, 'xs')} ${getSpacing(theme, 'sm')};
  background-color: ${getColor(theme, 'background.tertiary')};
  color: ${getColor(theme, 'text.secondary')};
  border-radius: ${getRadius(theme, 'sm')};
  font-size: 11px;
  font-weight: ${theme?.typography?.fontWeight?.medium || '500'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;
