/**
 * Enterprise UI Components - Main Export
 * 
 * Central export point for all enterprise UI components
 * following Clean Architecture principles.
 */

// Export types and utilities
export * from './types';
export * from './utils';

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

// Export navigation components
export { Tabs } from './navigation/Tabs';
export { SegmentedControl } from './navigation/SegmentedControl';

// Export display components
export { Avatar } from './display/Avatar';
export { Skeleton } from './display/Skeleton';
export { LoadingOverlay } from './display/LoadingOverlay';
export { Loader } from './display/Loader';
export { Image } from './display/Image';

// Re-export Theme for convenience
export type { Theme } from '@/app/theme';
