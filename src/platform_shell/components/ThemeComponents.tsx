/**
 * Theme-Aware Styled Components.
 * 
 * Styled components that integrate with the composable theme system.
 * Provides adaptive styling and responsive design patterns.
 */

import styled, { css } from 'styled-components';
import { useThemeTokens } from '../../core/theme';

/**
 * Theme-aware container component
 */
export const ThemeContainer = styled.div<{ 
  variant?: 'default' | 'card' | 'modal';
  responsive?: boolean;
}>`
  ${({ theme, variant = 'default', responsive = true }) => {
    const baseStyles = css`
      padding: ${theme.spacing.md};
      border-radius: ${theme.radius.md};
      background: ${theme.getColor('background.primary')};
      color: ${theme.getColor('text.primary')};
      transition: all ${theme.animation.duration.normal} ${theme.animation.easing.ease};
    `;
    
    const variantStyles = {
      default: css``,
      card: css`
        box-shadow: ${theme.shadows.md};
        border: 1px solid ${theme.getColor('border.light')};
      `,
      modal: css`
        box-shadow: ${theme.shadows.xl};
        border: 1px solid ${theme.getColor('border.medium')};
      `,
    };
    
    const responsiveStyles = responsive ? css`
      @media (max-width: ${theme.breakpoints.md}) {
        padding: ${theme.spacing.sm};
        border-radius: ${theme.radius.sm};
      }
    ` : css``;
    
    return css`
      ${baseStyles}
      ${variantStyles[variant]}
      ${responsiveStyles}
    `;
  }}
`;

/**
 * Theme-aware flex container
 */
export const ThemeFlexContainer = styled.div<{
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'center' | 'flex-end';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  gap?: keyof any;
  responsive?: boolean;
  wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${({ direction = 'row' }) => direction};
  align-items: ${({ align = 'center' }) => align};
  justify-content: ${({ justify = 'flex-start' }) => justify};
  gap: ${({ gap, theme }) => gap ? theme.spacing[gap as keyof typeof theme.spacing] : theme.spacing.sm};
  flex-wrap: ${({ wrap = false }) => wrap ? 'wrap' : 'nowrap'};
  
  ${({ theme, responsive = true }) => responsive && css`
    @media (max-width: ${theme.breakpoints.md}) {
      flex-direction: column;
      gap: ${theme.spacing.sm};
    }
  `}
`;

/**
 * Theme-aware grid container
 */
export const ThemeGridContainer = styled.div<{
  columns?: number;
  gap?: keyof any;
  responsive?: boolean;
}>`
  display: grid;
  grid-template-columns: ${({ columns = 1 }) => `repeat(${columns}, 1fr)`};
  gap: ${({ gap, theme }) => gap ? theme.spacing[gap as keyof typeof theme.spacing] : theme.spacing.md};
  
  ${({ theme, responsive = true }) => responsive && css`
    @media (max-width: ${theme.breakpoints.md}) {
      grid-template-columns: 1fr;
      gap: ${theme.spacing.sm};
    }
  `}
`;

/**
 * Theme-aware text component
 */
export const ThemeText = styled.div<{
  variant?: keyof any;
  size?: keyof any;
  weight?: keyof any;
  color?: string;
  responsive?: boolean;
}>`
  ${({ theme, variant = 'body', size = 'base', weight = 'normal', color, responsive = true }) => {
    const baseStyles = css`
      font-family: ${theme.typography.fontFamily.sans.join(', ')};
      font-size: ${theme.typography.fontSize[size]};
      font-weight: ${theme.typography.fontWeight[weight]};
      line-height: ${theme.typography.lineHeight.normal};
      color: ${color || theme.getColor('text.primary')};
      transition: color ${theme.animation.duration.fast} ${theme.animation.easing.ease};
    `;
    
    const variantStyles = {
      heading: css`
        font-weight: ${theme.typography.fontWeight.semibold};
        line-height: ${theme.typography.lineHeight.tight};
      `,
      subheading: css`
        font-weight: ${theme.typography.fontWeight.medium};
        line-height: ${theme.typography.lineHeight.tight};
      `,
      body: css``,
      caption: css`
        font-size: ${theme.typography.fontSize.sm};
        color: ${theme.getColor('text.secondary')};
      `,
    };
    
    const responsiveStyles = responsive ? css`
      @media (max-width: ${theme.breakpoints.md}) {
        font-size: ${size === 'lg' ? theme.typography.fontSize.base : theme.typography.fontSize[size]};
      }
    ` : css``;
    
    return css`
      ${baseStyles}
      ${variantStyles[variant]}
      ${responsiveStyles}
    `;
  }}
`;

/**
 * Theme-aware button component
 */
export const ThemeButton = styled.button<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  responsive?: boolean;
}>`
  ${({ theme, variant = 'primary', size = 'md', responsive = true }) => {
    const baseStyles = css`
      border: none;
      border-radius: ${theme.radius.md};
      cursor: pointer;
      font-weight: ${theme.typography.fontWeight.semibold};
      transition: all ${theme.animation.duration.fast} ${theme.animation.easing.ease};
      display: inline-flex;
      align-items: center;
      justify-content: center;
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `;
    
    const variantStyles = {
      primary: css`
        background: ${theme.getColor('brand.500')};
        color: white;
        &:hover:not(:disabled) {
          background: ${theme.getColor('brand.600')};
        }
      `,
      secondary: css`
        background: ${theme.getColor('neutral.500')};
        color: white;
        &:hover:not(:disabled) {
          background: ${theme.getColor('neutral.600')};
        }
      `,
      outline: css`
        background: transparent;
        border: 2px solid ${theme.getColor('brand.500')};
        color: ${theme.getColor('brand.500')};
        &:hover:not(:disabled) {
          background: ${theme.getColor('brand.50')};
        }
      `,
      ghost: css`
        background: transparent;
        color: ${theme.getColor('brand.500')};
        &:hover:not(:disabled) {
          background: ${theme.getColor('brand.100')};
        }
      `,
    };
    
    const sizeStyles = {
      sm: css`
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        font-size: ${theme.typography.fontSize.sm};
        border-radius: ${theme.radius.sm};
      `,
      md: css`
        padding: ${theme.spacing.md} ${theme.spacing.lg};
        font-size: ${theme.typography.fontSize.base};
      `,
      lg: css`
        padding: ${theme.spacing.lg} ${theme.spacing.xl};
        font-size: ${theme.typography.fontSize.lg};
        border-radius: ${theme.radius.lg};
      `,
    };
    
    const responsiveStyles = responsive ? css`
      @media (max-width: ${theme.breakpoints.md}) {
        ${size === 'lg' && css`
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          font-size: ${theme.typography.fontSize.base};
        `}
      }
    ` : css``;
    
    return css`
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${responsiveStyles}
    `;
  }}
`;
