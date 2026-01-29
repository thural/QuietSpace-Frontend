/**
 * UI Components Black Box Index
 * 
 * Provides clean public API for the UI components following Black Box pattern.
 * Only interfaces, factory functions, and essential components are exported.
 * Implementation details and internal modules are properly hidden.
 */

// Public types and utilities - Clean API
export type {
    BaseComponentProps,
    LayoutProps,
    FlexProps,
    TypographyProps,
    InteractiveProps,
    ButtonProps,
    InputProps,
    ComponentVariant,
    ComponentSize,
    ComponentStyles,
    ComponentConfig
} from './types';

// Export layout components
export { Container } from './layout/Container';
export { CenterContainer } from './layout/CenterContainer';
export { FlexContainer } from './layout/FlexContainer';

// Export typography components
export { default as Text } from './typography/Text';
export { default as Title } from './typography/Title';

// Export interactive components
export { Button } from './interactive/Button';
export { Input } from './interactive/Input';
export { Switch } from './interactive/Switch';
export { PinInput } from './interactive/PinInput';
export { FileInput } from './interactive/FileInput';
export { Progress } from './interactive/Progress';

// Export navigation components
export { Tabs } from './navigation/Tabs';
export { SegmentedControl } from './navigation/SegmentedControl';

// Export display components
export { Avatar } from './display/Avatar';
export { Skeleton } from './display/Skeleton';
export { LoadingOverlay } from './display/LoadingOverlay';
export { Loader } from './display/Loader';
export { Image } from './display/Image';
export { Badge } from './display/Badge';

// Theme integration - Clean API
export type { Theme } from '@/app/theme';

// Essential hooks for UI integration
export {
    useTheme,
    useThemeTokens
} from '@/core/theme';

// Legacy wildcard exports (deprecated - will be removed in next major version)
export * from './types';
export * from './utils';
