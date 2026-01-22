/**
 * Styled Components Performance Utilities.
 * 
 * Optimized utilities for creating styled components with better performance.
 * Includes memoization, CSS-in-JS optimizations, and component patterns.
 */

import React, { useMemo } from 'react';
import styled, { css, keyframes, DefaultTheme } from 'styled-components';
import { useTheme, EnhancedTheme as AppTheme } from './EnhancedThemeProvider';

// Extend DefaultTheme to include our enhanced theme (which has backward compatibility)
declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}

/**
 * Optimized styled component factory with memoization
 */
export const createStyledComponent = <T extends keyof React.JSX.IntrinsicElements>(tag: T) => {
  return styled(tag).withConfig({
    shouldForwardProp: (prop) => !['as', 'variant', 'theme'].includes(prop),
  });
};

/**
 * Responsive utility for media queries
 */
export const media = {
  mobile: (styles: any) => css`
    @media (max-width: 768px) {
      ${styles}
    }
  `,
  wide: (styles: any) => css`
    @media (min-width: 769px) {
      ${styles}
    }
  `,
};

/**
 * Optimized keyframes for animations
 */
export const animations = {
  fadeIn: keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `,
  slideUp: keyframes`
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  `,
  scaleIn: keyframes`
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  `,
};

/**
 * Performance-optimized container component
 */
export const Container = createStyledComponent('div')`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
  
  ${media.mobile(css`
    padding: 0 ${({ theme }) => theme.spacing.sm};
  `)}
`;

/**
 * Optimized flex container with memoization
 */
export const FlexContainer = createStyledComponent('div')<{ 
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'center' | 'flex-end';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  gap?: string;
}>`
  display: flex;
  flex-direction: ${({ direction = 'row' }) => direction};
  align-items: ${({ align = 'center' }) => align};
  justify-content: ${({ justify = 'flex-start' }) => justify};
  gap: ${({ gap = '0' }) => gap};
`;

/**
 * Optimized grid container
 */
export const GridContainer = createStyledComponent('div')<{ 
  columns?: number;
  gap?: string;
}>`
  display: grid;
  grid-template-columns: ${({ columns = 1 }) => `repeat(${columns}, 1fr)`};
  gap: ${({ gap = '0' }) => gap};
  
  ${media.mobile(css`
    grid-template-columns: 1fr;
  `)}
`;

/**
 * Hook for creating responsive styles
 */
export const useResponsiveStyles = () => {
  const theme = useTheme();
  
  return useMemo(() => ({
    getSpacing: (key: keyof typeof theme.spacing) => theme.spacing[key],
    getColor: (colorPath: string) => {
      const keys = colorPath.split('.');
      return keys.reduce((obj: any, key) => obj?.[key], theme.colors);
    },
    getTypography: (key: keyof typeof theme.typography) => theme.typography[key],
    getBreakpoint: (key: keyof typeof theme.breakpoints) => theme.breakpoints[key],
  }), [theme]);
};

/**
 * Optimized button component with variants
 */
export const StyledButton = createStyledComponent('button')<{
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}>`
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  
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
          border: 2px solid ${theme.primary[500]};
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
          padding: 8px 16px;
          font-size: 14px;
        `;
      case 'lg':
        return css`
          padding: 16px 32px;
          font-size: 18px;
        `;
      default:
        return css`
          padding: 12px 24px;
          font-size: 16px;
        `;
    }
  }}
`;
