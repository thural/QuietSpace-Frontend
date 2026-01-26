/**
 * Animation Token Types.
 * 
 * Type definitions for animation-related theme tokens.
 * Provides clean separation of animation type definitions.
 */

export interface AnimationTokens {
    duration: {
        fast: string;
        normal: string;
        slow: string;
    };

    easing: {
        ease: string;
        easeIn: string;
        easeOut: string;
        easeInOut: string;
    };
}
