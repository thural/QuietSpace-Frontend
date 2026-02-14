/**
 * Avatar Component Index
 * 
 * Clean public API exports for the Avatar component.
 * Exports component, interfaces, and styles separately.
 */

// Component export
export { default } from './Avatar';

// Interface exports
export type { IAvatarProps } from './interfaces/Avatar';

// Style exports
export { 
    createAvatarContainerStyles, 
    createAvatarImageStyles, 
    createAvatarPlaceholderStyles,
    getAvatarSize,
    getAvatarRadius
} from './styles';
