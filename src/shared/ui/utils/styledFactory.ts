/**
 * Styled Component Factory.
 *
 * Factory functions for creating optimized styled components.
 * Provides clean separation of component creation logic.
 * 
 * Moved from core theming to shared UI utilities.
 */

import styled from 'styled-components';

/**
 * Optimized styled component factory with memoization
 */
export const createStyledComponent = <T extends keyof React.JSX.IntrinsicElements>(tag: T) => {
    return styled(tag).withConfig({
        shouldForwardProp: (prop) => !['as', 'variant', 'theme'].includes(prop)
    });
};
