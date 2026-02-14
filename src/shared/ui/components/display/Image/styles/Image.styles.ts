/**
 * Image Component Styles
 * 
 * Emotion CSS styles for the Image component with responsive features.
 */

import { css } from '@emotion/react';
import { getRadius, getTransition } from '../../../utils';

/**
 * Create image styles using theme tokens
 */
export const createImageStyles = (radius?: string) => css`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: ${radius || '0'};
    transition: ${getTransition(undefined, 'all', 'fast', 'ease')};
`;
