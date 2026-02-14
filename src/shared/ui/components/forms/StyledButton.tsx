/**
 * StyledButton Component.
 *
 * Optimized button component with variants and sizes.
 * Provides consistent button styling across the application.
 */

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { getBorderWidth, getRadius, getSpacing, getTypography, getColor } from '../utils';

/**
 * Optimized button component with variants
 */
export const StyledButton = ({ variant = 'primary', size = 'md', className, ...props }: {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  [key: string]: any;
}) => {
  const baseStyles = css`
    border: none;
    border-radius: ${getRadius({} as any, 'md')};
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
  `;

  const variantStyles = css`
    ${variant === 'primary' && css`
      background: ${getColor({} as any, 'primary.500')};
      color: white;
      &:hover {
        background: ${getColor({} as any, 'primary.600')};
      }
    `}
    ${variant === 'secondary' && css`
      background: ${getColor({} as any, 'secondary.500')};
      color: white;
      &:hover {
        background: ${getColor({} as any, 'secondary.600')};
      }
    `}
    ${variant === 'outline' && css`
      background: transparent;
      border: ${getBorderWidth({} as any, 'sm')} solid ${getColor({} as any, 'primary.500')};
      color: ${getColor({} as any, 'primary.500')};
      &:hover {
        background: ${getColor({} as any, 'primary.50')};
      }
    `}
  `;

  const sizeStyles = css`
    ${size === 'sm' && css`
      padding: ${getSpacing({} as any, 'xs')} ${getSpacing({} as any, 'sm')};
      font-size: ${getTypography({} as any, 'fontSize.sm')};
    `}
    ${size === 'lg' && css`
      padding: ${getSpacing({} as any, 'sm')} ${getSpacing({} as any, 'lg')};
      font-size: ${getTypography({} as any, 'fontSize.lg')};
    `}
    ${size === 'md' && css`
      padding: ${getSpacing({} as any, 'xs')} ${getSpacing({} as any, 'md')};
      font-size: ${getTypography({} as any, 'fontSize.base')};
    `}
  `;

  return (
    <button
      css={[baseStyles, variantStyles, sizeStyles]}
      className={className}
      {...props}
    />
  );
};
