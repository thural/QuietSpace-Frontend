/**
 * Theme System Interfaces.
 * 
 * Centralized exports for all theme system interfaces.
 * Provides focused, segregated interfaces for better modularity.
 */

// Color interfaces
export type {
    ColorPalette,
    SemanticColors,
    BackgroundColors,
    TextColors,
    BorderColors,
    ColorSystem,
    ColorUtilities
} from './ColorInterfaces';

// Typography interfaces
export type {
    FontSize,
    FontWeight,
    LineHeight,
    FontFamily,
    TypographySystem,
    TypographyUtilities
} from './TypographyInterfaces';

// Layout interfaces
export type {
    Spacing,
    Shadow,
    Breakpoint,
    Radius,
    LayoutSystem,
    LayoutUtilities
} from './LayoutInterfaces';
