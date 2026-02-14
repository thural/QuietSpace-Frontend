/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { getBorderWidth, getRadius, getSpacing, getTypography, getColor } from '../../utils';

/**
 * Base button styles
 */
export const BaseButtonStyles = (theme: any) => css`
  border: none;
  border-radius: ${getRadius(theme || {} as any, 'md')};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

/**
 * Button variant styles
 */
export const VariantStyles = (theme: any, variant: 'primary' | 'secondary' | 'outline') => css`
  ${variant === 'primary' && css`
    background: ${getColor(theme || {} as any, 'brand.500')};
    color: ${getColor(theme || {} as any, 'text.inverse')};
    &:hover:not(:disabled) {
      background: ${getColor(theme || {} as any, 'brand.600')};
    }
  `}
  ${variant === 'secondary' && css`
    background: ${getColor(theme || {} as any, 'background.secondary')};
    color: ${getColor(theme || {} as any, 'text.primary')};
    &:hover:not(:disabled) {
      background: ${getColor(theme || {} as any, 'background.tertiary')};
    }
  `}
  ${variant === 'outline' && css`
    background: transparent;
    border: ${getBorderWidth(theme || {} as any, 'sm')} solid ${getColor(theme || {} as any, 'brand.500')};
    color: ${getColor(theme || {} as any, 'brand.500')};
    &:hover:not(:disabled) {
      background: ${getColor(theme || {} as any, 'brand.50')};
    }
  `}
`;

/**
 * Button size styles
 */
export const SizeStyles = (theme: any, size: 'sm' | 'md' | 'lg') => css`
  ${size === 'sm' && css`
    padding: ${getSpacing(theme || {} as any, 'xs')} ${getSpacing(theme || {} as any, 'sm')};
    font-size: ${getTypography(theme || {} as any, 'fontSize.sm')};
  `}
  ${size === 'lg' && css`
    padding: ${getSpacing(theme || {} as any, 'sm')} ${getSpacing(theme || {} as any, 'lg')};
    font-size: ${getTypography(theme || {} as any, 'fontSize.lg')};
  `}
  ${size === 'md' && css`
    padding: ${getSpacing(theme || {} as any, 'sm')} ${getSpacing(theme || {} as any, 'md')};
    font-size: ${getTypography(theme || {} as any, 'fontSize.base')};
  `}
`;
