/**
 * Progress Component Styles
 * 
 * Emotion CSS styles for the Progress component with animations.
 */

import { css, keyframes } from '@emotion/react';
import { getColor, getRadius, getSpacing, getTransition } from '../../../utils';

/**
 * Progress stripes animation
 */
export const progressStripes = keyframes`
  0% {
    background-position: 40px 0;
  }
  100% {
    background-position: 0 0;
  }
`;

/**
 * Create progress container styles using theme tokens
 */
export const createProgressContainerStyles = (theme: any, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeStyles = {
        sm: { height: '4px', fontSize: getTypography(theme, 'fontSize.xs') },
        md: { height: '8px', fontSize: getTypography(theme, 'fontSize.sm') },
        lg: { height: '12px', fontSize: getTypography(theme, 'fontSize.base') }
    };
    
    const currentSize = sizeStyles[size] || sizeStyles.md;
    
    return css`
        width: 100%;
        height: ${currentSize.height};
        background-color: ${getColor(theme, 'background.tertiary')};
        border-radius: ${getRadius(theme, 'full')};
        overflow: hidden;
        position: relative;
    `;
};

/**
 * Create progress bar styles using theme tokens
 */
export const createProgressBarStyles = (theme: any, value: number = 0, max: number = 100, color?: string, striped?: boolean, animated?: boolean) => {
    const percentage = Math.min((value / max) * 100, 100);
    const barColor = color || getColor(theme, 'brand.500');
    
    return css`
        height: 100%;
        background-color: ${barColor};
        border-radius: ${getRadius(theme, 'full')};
        transition: ${getTransition(theme, 'width', 'normal', 'ease')};
        width: ${percentage}%;
        
        ${striped && css`
            background-image: linear-gradient(
                45deg,
                rgba(255, 255, 255, 0.15) 25%,
                transparent 25%,
                transparent 50%,
                rgba(255, 255, 255, 0.15) 50%,
                rgba(255, 255, 255, 0.15) 75%,
                transparent 75%,
                transparent
            );
            background-size: 40px 40px;
            ${animated && css`
                animation: ${progressStripes} 1s linear infinite;
            `}
        `}
    `;
};
