/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

/**
 * Get change color based on type
 */
export const getChangeColor = (type: 'increase' | 'decrease' | 'neutral'): string => {
    const colors = {
        increase: 'text-green-600',
        decrease: 'text-red-600',
        neutral: 'text-gray-600'
    };

    return colors[type];
};

/**
 * Get trend icon
 */
export const getTrendIcon = (trend: 'up' | 'down' | 'stable'): string => {
    const icons = {
        up: '📈',
        down: '📉',
        stable: '➡️'
    };

    return icons[trend];
};

/**
 * Get card styles based on variant and size
 */
export const getCardStyles = (
    variant: 'default' | 'compact' | 'detailed',
    size: 'sm' | 'md' | 'lg',
    color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray',
    onClick?: () => void,
    isHovered: boolean = false,
    className: string = ''
): string => {
    const baseStyles = 'bg-white rounded-lg shadow transition-all duration-200';
    
    const sizeStyles = {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6'
    };

    const colorStyles = {
        blue: 'border-l-4 border-blue-500',
        green: 'border-l-4 border-green-500',
        red: 'border-l-4 border-red-500',
        yellow: 'border-l-4 border-yellow-500',
        purple: 'border-l-4 border-purple-500',
        gray: 'border-l-4 border-gray-500'
    };

    const interactionStyles = onClick
        ? isHovered ? 'shadow-lg cursor-pointer transform scale-105' : 'cursor-pointer'
        : '';

    const variantStyles = variant === 'compact' ? 'border-l-0' : '';

    return `${baseStyles} ${sizeStyles[size]} ${colorStyles[color]} ${interactionStyles} ${variantStyles} ${className}`;
};

/**
 * Get value styles based on size
 */
export const getValueStyles = (size: 'sm' | 'md' | 'lg'): string => {
    const styles = {
        sm: 'text-lg font-bold',
        md: 'text-2xl font-bold',
        lg: 'text-3xl font-bold'
    };

    return styles[size];
};

/**
 * Get label styles based on size
 */
export const getLabelStyles = (size: 'sm' | 'md' | 'lg'): string => {
    const styles = {
        sm: 'text-xs font-medium',
        md: 'text-sm font-medium',
        lg: 'text-base font-medium'
    };

    return styles[size];
};

/**
 * Create loading styles
 */
export const createLoadingStyles = () => css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
`;

/**
 * Create error styles
 */
export const createErrorStyles = () => css`
    text-align: center;
    padding: 1rem;
    color: #ef4444;
    font-size: 0.875rem;
    
    & .error-message {
        color: #f87171;
        font-size: 0.75rem;
        margin-top: 0.25rem;
    }
`;
