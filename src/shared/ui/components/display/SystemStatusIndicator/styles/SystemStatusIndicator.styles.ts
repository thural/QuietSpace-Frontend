/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { SystemStatusType } from '../interfaces';

/**
 * Get status color
 */
export const getStatusColor = (status: SystemStatusType): string => {
    const colors: Record<SystemStatusType, string> = {
        healthy: '#10b981',
        degraded: '#f59e0b',
        down: '#ef4444',
        unknown: '#6b7280'
    };

    return colors[status] || colors.unknown;
};

/**
 * Get status icon
 */
export const getStatusIcon = (status: SystemStatusType): string => {
    const icons: Record<SystemStatusType, string> = {
        healthy: '✅',
        degraded: '⚠️',
        down: '❌',
        unknown: '❓'
    };

    return icons[status] || icons.unknown;
};

/**
 * Get status text
 */
export const getStatusText = (status: SystemStatusType): string => {
    const texts: Record<SystemStatusType, string> = {
        healthy: 'Healthy',
        degraded: 'Degraded',
        down: 'Down',
        unknown: 'Unknown'
    };

    return texts[status] || texts.unknown;
};

/**
 * Create container styles
 */
export const createContainerStyles = (
    variant: 'dots' | 'cards' | 'list',
    orientation: 'horizontal' | 'vertical',
    size: 'sm' | 'md' | 'lg',
    compact: boolean = false,
    className: string = ''
) => {
    const isHorizontal = orientation === 'horizontal';
    const gapMap = {
        sm: compact ? '0.5rem' : '0.75rem',
        md: compact ? '0.75rem' : '1rem',
        lg: compact ? '1rem' : '1.5rem'
    };

    return css`
        display: flex;
        ${isHorizontal ? 'flex-direction: row;' : 'flex-direction: column;'}
        gap: ${gapMap[size]};
        align-items: ${isHorizontal ? 'center' : 'flex-start'};
        
        ${variant === 'list' && css`
            flex-direction: column;
            align-items: stretch;
        `}
        
        ${className}
    `;
};

/**
 * Create status dot styles
 */
export const createStatusDotStyles = (
    status: SystemStatusType,
    size: 'sm' | 'md' | 'lg'
) => {
    const sizeMap = {
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem'
    };

    return css`
        width: ${sizeMap[size]};
        height: ${sizeMap[size]};
        border-radius: 50%;
        background-color: ${getStatusColor(status)};
        border: 2px solid #ffffff;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
        flex-shrink: 0;
        
        &:hover {
            transform: scale(1.1);
            box-shadow: 0 0 0 2px ${getStatusColor(status)}33;
        }
    `;
};

/**
 * Create status card styles
 */
export const createStatusCardStyles = (
    status: SystemStatusType,
    size: 'sm' | 'md' | 'lg',
    isHovered: boolean = false
) => {
    const paddingMap = {
        sm: '0.5rem 0.75rem',
        md: '0.75rem 1rem',
        lg: '1rem 1.25rem'
    };

    const fontSizeMap = {
        sm: '0.75rem',
        md: '0.875rem',
        lg: '1rem'
    };

    return css`
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: ${paddingMap[size]};
        background-color: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        font-size: ${fontSizeMap[size]};
        color: #374151;
        cursor: pointer;
        transition: all 0.2s ease;
        
        ${isHovered && css`
            border-color: ${getStatusColor(status)};
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transform: translateY(-1px);
        `}
        
        .status-dot {
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 50%;
            background-color: ${getStatusColor(status)};
            flex-shrink: 0;
        }
        
        .status-icon {
            font-size: ${size === 'sm' ? '0.875rem' : size === 'md' ? '1rem' : '1.25rem'};
        }
        
        .status-label {
            font-weight: 500;
            color: #1f2937;
        }
        
        .status-text {
            color: #6b7280;
            font-size: 0.875em;
        }
    `;
};

/**
 * Create status list styles
 */
export const createStatusListStyles = (
    size: 'sm' | 'md' | 'lg'
) => {
    const paddingMap = {
        sm: '0.5rem 0.75rem',
        md: '0.75rem 1rem',
        lg: '1rem 1.25rem'
    };

    return css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: ${paddingMap[size]};
        background-color: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
        font-size: ${size === 'sm' ? '0.875rem' : size === 'md' ? '1rem' : '1.125rem'};
        
        &:hover {
            background-color: #f9fafb;
            border-color: #d1d5db;
        }
        
        .status-left {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .status-right {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #6b7280;
            font-size: 0.875em;
        }
        
        .status-indicator {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .status-dot {
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 50%;
            background-color: #6b7280;
        }
        
        .status-label {
            font-weight: 500;
            color: #1f2937;
        }
        
        .status-details {
            color: #6b7280;
            font-size: 0.875em;
        }
    `;
};

/**
 * Create label styles
 */
export const createLabelStyles = (
    size: 'sm' | 'md' | 'lg',
    showLabels: boolean = true
) => {
    if (!showLabels) return css`display: none;`;

    const fontSizeMap = {
        sm: '0.75rem',
        md: '0.875rem',
        lg: '1rem'
    };

    return css`
        font-size: ${fontSizeMap[size]};
        font-weight: 500;
        color: #374151;
        margin-left: 0.5rem;
    `;
};

/**
 * Create details styles
 */
export const createDetailsStyles = (
    size: 'sm' | 'md' | 'lg',
    showDetails: boolean = true
) => {
    if (!showDetails) return css`display: none;`;

    const fontSizeMap = {
        sm: '0.625rem',
        md: '0.75rem',
        lg: '0.875rem'
    };

    return css`
        font-size: ${fontSizeMap[size]};
        color: #6b7280;
        margin-top: 0.25rem;
        line-height: 1.4;
    `;
};

/**
 * Create last checked styles
 */
export const createLastCheckedStyles = (
    size: 'sm' | 'md' | 'lg',
    showLastChecked: boolean = true
) => {
    if (!showLastChecked) return css`display: none;`;

    const fontSizeMap = {
        sm: '0.625rem',
        md: '0.75rem',
        lg: '0.875rem'
    };

    return css`
        font-size: ${fontSizeMap[size]};
        color: #9ca3af;
        font-style: italic;
        margin-top: 0.25rem;
    `;
};
