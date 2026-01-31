/**
 * Styled Components Performance Utilities.
 * 
 * Legacy file maintained for backward compatibility.
 * All functionality has been moved to dedicated modules.
 * 
 * @deprecated Import from specific modules instead:
 * - factories/styledFactory
 * - utils/mediaQueries  
 * - animations/animations
 * - components/layoutComponents
 * - components/uiComponents
 * - hooks/utilityHooks
 */

// Re-export from new locations for backward compatibility
export { createStyledComponent } from './factories/styledFactory.js';
export { media } from './utils/mediaQueries.js';
export { animations } from './animations/animations.js';
export { Container, FlexContainer, GridContainer } from './components/layoutComponents.js';
export { StyledButton } from './components/uiComponents.js';
export { useResponsiveStyles } from './hooks/utilityHooks.js';
