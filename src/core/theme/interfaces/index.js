/**
 * Theme System Interfaces.
 * 
 * Centralized exports for all theme system interfaces.
 * Provides focused, segregated interfaces for better modularity.
 */

// Color interfaces
export {
    ColorPalette,
    SemanticColors,
    BackgroundColors,
    TextColors,
    BorderColors,
    ColorSystem,
    ColorUtilities
} from './ColorInterfaces.js';

// Typography interfaces
export {
    FontSize,
    FontWeight,
    LineHeight,
    FontFamily,
    TypographySystem,
    TypographyUtilities
} from './TypographyInterfaces.js';

// Layout interfaces
export {
    Spacing,
    Shadow,
    Breakpoint,
    Radius,
    LayoutSystem,
    LayoutUtilities
} from './LayoutInterfaces.js';
