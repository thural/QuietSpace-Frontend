/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

/**
 * Get type icon for result item
 */
export const getTypeIcon = (type: string): string => {
    const icons = {
        user: '👤',
        post: '📝',
        content: '📄',
        page: '📃',
        file: '📁',
        generic: '📎'
    };

    return icons[type as keyof typeof icons] || icons.generic;
};

/**
 * Get type color for result item
 */
export const getTypeColor = (type: string): string => {
    const colors = {
        user: '#3b82f6',
        post: '#10b981',
        content: '#f59e0b',
        page: '#8b5cf6',
        file: '#ef4444',
        generic: '#6b7280'
    };

    return colors[type as keyof typeof colors] || colors.generic;
};

/**
 * Create result item container styles
 */
export const createResultItemStyles = (
    variant: 'default' | 'compact' | 'detailed' | 'card',
    isHovered: boolean = false,
    className: string = ''
) => css`
    display: flex;
    align-items: flex-start;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    background-color: #ffffff;
    transition: all 0.2s ease;
    cursor: pointer;
    
    ${isHovered && css`
        border-color: #d1d5db;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        transform: translateY(-1px);
    `}
    
    ${variant === 'compact' && css`
        padding: 0.75rem;
        gap: 0.75rem;
    `}
    
    ${variant === 'card' && css`
        flex-direction: column;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        
        &:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
    `}
    
    ${className}
`;

/**
 * Create thumbnail styles
 */
export const createThumbnailStyles = (
    variant: 'default' | 'compact' | 'detailed' | 'card',
    showThumbnail: boolean = true
) => {
    if (!showThumbnail) return css`display: none;`;

    const sizeMap = {
        default: '3rem',
        compact: '2.5rem',
        detailed: '4rem',
        card: '100%'
    };

    return css`
        width: ${sizeMap[variant]};
        height: ${sizeMap[variant]};
        border-radius: 0.375rem;
        object-fit: cover;
        background-color: #f3f4f6;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        color: #6b7280;
        flex-shrink: 0;
        
        ${variant === 'card' && css`
            height: 8rem;
            margin-bottom: 1rem;
        `}
    `;
};

/**
 * Create content styles
 */
export const createContentStyles = (
    variant: 'default' | 'compact' | 'detailed' | 'card',
    showThumbnail: boolean = true
) => css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 0;
    
    ${variant === 'card' && css`
        gap: 0.75rem;
    `}
    
    ${!showThumbnail && variant !== 'card' && css`
        margin-left: 0;
    `}
`;

/**
 * Create title styles
 */
export const createTitleStyles = (
    variant: 'default' | 'compact' | 'detailed' | 'card'
) => {
    const sizeMap = {
        default: '1rem',
        compact: '0.875rem',
        detailed: '1.125rem',
        card: '1rem'
    };

    const weightMap = {
        default: '600',
        compact: '600',
        detailed: '700',
        card: '600'
    };

    return css`
        font-size: ${sizeMap[variant]};
        font-weight: ${weightMap[variant]};
        color: #1f2937;
        line-height: 1.4;
        margin: 0;
        
        &:hover {
            color: #3b82f6;
        }
    `;
};

/**
 * Create description styles
 */
export const createDescriptionStyles = (
    variant: 'default' | 'compact' | 'detailed' | 'card'
) => {
    const sizeMap = {
        default: '0.875rem',
        compact: '0.75rem',
        detailed: '1rem',
        card: '0.875rem'
    };

    return css`
        font-size: ${sizeMap[variant]};
        color: #6b7280;
        line-height: 1.5;
        margin: 0;
        
        ${variant === 'compact' && css`
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        `}
    `;
};

/**
 * Create author styles
 */
export const createAuthorStyles = (
    variant: 'default' | 'compact' | 'detailed' | 'card'
) => {
    const sizeMap = {
        default: '0.75rem',
        compact: '0.625rem',
        detailed: '0.875rem',
        card: '0.75rem'
    };

    return css`
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: ${sizeMap[variant]};
        color: #6b7280;
        
    .author-avatar {
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 50%;
        object-fit: cover;
    }
    
    .author-name {
        font-weight: 500;
        color: #374151;
    }
    
    .author-username {
        color: #6b7280;
    }
    `;
};

/**
 * Create metadata styles
 */
export const createMetadataStyles = (
    variant: 'default' | 'compact' | 'detailed' | 'card'
) => {
    const sizeMap = {
        default: '0.75rem',
        compact: '0.625rem',
        detailed: '0.875rem',
        card: '0.75rem'
    };

    return css`
        display: flex;
        align-items: center;
        gap: 1rem;
        font-size: ${sizeMap[variant]};
        color: #6b7280;
        flex-wrap: wrap;
        
    .metadata-item {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .metadata-separator {
        color: #d1d5db;
    }
    `;
};
