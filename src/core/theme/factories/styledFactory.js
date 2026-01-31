/**
 * Styled Component Factory.
 * 
 * Factory functions for creating optimized styled components.
 * Provides clean separation of component creation logic.
 */

import styled, { css } from 'styled-components';

/**
 * Optimized styled component factory with memoization
 * @param {string} tag - HTML tag name
 * @returns {Function} Styled component factory
 * @description Creates optimized styled components with config
 */
export const createStyledComponent = (tag) => {
    return styled(tag).withConfig({
        shouldForwardProp: (prop) => !['as', 'variant', 'theme'].includes(prop),
    });
};
