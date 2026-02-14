/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

/**
 * Create dashboard container styles
 */
export const createDashboardStyles = (
    variant: 'default' | 'compact' | 'detailed',
    size: 'sm' | 'md' | 'lg',
    gridColumns: number = 3,
    className: string = ''
) => css`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    
    ${variant === 'compact' && css`
        gap: 1rem;
    `}
    
    ${variant === 'detailed' && css`
        gap: 2rem;
    `}
    
    ${className}
`;

/**
 * Create section styles
 */
export const createSectionStyles = (
    showSectionHeaders: boolean = true,
    columns: number = 3
) => css`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    
    ${showSectionHeaders && css`
        margin-bottom: 1rem;
    `}
`;

/**
 * Create section header styles
 */
export const createSectionHeaderStyles = () => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    
    h3 {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0;
    }
    
    p {
        font-size: 0.875rem;
        color: #6b7280;
        margin: 0;
        margin-top: 0.25rem;
    }
`;

/**
 * Create grid styles for metrics
 */
export const createGridStyles = (
    columns: number = 3,
    size: 'sm' | 'md' | 'lg' = 'md'
) => {
    const gapMap = {
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem'
    };

    return css`
        display: grid;
        grid-template-columns: repeat(${columns}, 1fr);
        gap: ${gapMap[size]};
        
        @media (max-width: 768px) {
            grid-template-columns: repeat(${Math.min(columns, 2)}, 1fr);
        }
        
        @media (max-width: 480px) {
            grid-template-columns: 1fr;
        }
    `;
};

/**
 * Create loading container styles
 */
export const createLoadingContainerStyles = () => css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    color: #6b7280;
    
    .spinner {
        width: 2rem;
        height: 2rem;
        border: 2px solid #e5e7eb;
        border-top: 2px solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 0.75rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

/**
 * Create error container styles
 */
export const createErrorContainerStyles = () => css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    color: #ef4444;
    text-align: center;
    
    .error-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    .error-title {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }
    
    .error-message {
        font-size: 0.875rem;
        color: #6b7280;
    }
`;

/**
 * Create refresh button styles
 */
export const createRefreshButtonStyles = () => css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    color: #374151;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
        background-color: #e5e7eb;
        border-color: #9ca3af;
    }
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .refresh-icon {
        transition: transform 0.5s;
        
        &.spinning {
            animation: spin 1s linear infinite;
        }
    }
`;
