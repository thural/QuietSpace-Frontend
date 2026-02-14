/**
 * Loader Component Styles
 * 
 * Emotion CSS styles for the Loader component with animations.
 */

import { css, keyframes } from '@emotion/react';
import { getSpacing, getColor, getBorderWidth, getTransition } from '../../../utils';

/**
 * Spinner animation keyframes
 */
export const spinKeyframes = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

/**
 * Create loader container styles using theme tokens
 */
export const createLoaderContainerStyles = () => css`
    display: flex;
    align-items: center;
    justify-content: center;
`;

/**
 * Create spinner styles using theme tokens
 */
export const createSpinnerStyles = (
    theme: any,
    size?: string,
    color?: string,
    borderWidth?: string
) => css`
    width: ${size || '30px'};
    height: ${size || '30px'};
    border: ${borderWidth || '3px'} solid ${getColor(theme, 'background.secondary')};
    border-top: ${borderWidth || '3px'} solid ${color || getColor(theme, 'brand.500')};
    border-radius: 50%;
    animation: ${spinKeyframes} 1s linear infinite;
    transition: ${getTransition(theme, 'all', 'normal', 'ease')};
`;
