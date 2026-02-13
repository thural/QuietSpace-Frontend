/**
 * StyledButton Component.
 *
 * Optimized button component with variants and sizes.
 * Provides consistent button styling across the application.
 */

import { css } from 'styled-components';
import { getBorderWidth, getRadius, getSpacing, getTypography } from '../utils';

import { createStyledComponent } from '@core/modules/theming/factories/styledFactory';

// Extend DefaultTheme to include our enhanced theme
declare module 'styled-components' {
  export interface DefaultTheme {
    primary: Record<string, string>;
    secondary: Record<string, string>;
  }
}

/**
 * Optimized button component with variants
 */
export const StyledButton = createStyledComponent('button') <{
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}>`
  border: none;
  border-radius: ${({ theme }) => getRadius(theme, 'md')};
  cursor: pointer;
  font-weight: 600;
  transition: all ${({ theme }) => theme.animation?.duration?.fast || '0.2s'} ${({ theme }) => theme.animation?.easing?.ease || 'ease'};
  
  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'primary':
        return css`
          background: ${theme.primary[500]};
          color: white;
          &:hover {
            background: ${theme.primary[600]};
          }
        `;
      case 'secondary':
        return css`
          background: ${theme.secondary[500]};
          color: white;
          &:hover {
            background: ${theme.secondary[600]};
          }
        `;
      case 'outline':
        return css`
          background: transparent;
          border: ${({ theme }) => getBorderWidth(theme, 'sm')} solid ${theme.primary[500]};
          color: ${theme.primary[500]};
          &:hover {
            background: ${theme.primary[50]};
          }
        `;
      default:
        return '';
    }
  }}
  
  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: ${({ theme }) => getSpacing(theme, 'xs')} ${({ theme }) => getSpacing(theme, 'sm')};
          font-size: ${({ theme }) => getTypography(theme, 'fontSize.sm')};
        `;
      case 'lg':
        return css`
          padding: ${({ theme }) => getSpacing(theme, 'sm')} ${({ theme }) => getSpacing(theme, 'lg')};
          font-size: ${({ theme }) => getTypography(theme, 'fontSize.lg')};
        `;
      default:
        return css`
          padding: ${({ theme }) => getSpacing(theme, 'xs')} ${({ theme }) => getSpacing(theme, 'md')};
          font-size: ${({ theme }) => getTypography(theme, 'fontSize.base')};
        `;
    }
  }}
`;
