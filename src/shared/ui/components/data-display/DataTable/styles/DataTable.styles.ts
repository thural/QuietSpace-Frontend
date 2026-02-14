/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

/**
 * Create data table container styles
 */
export const createDataTableContainerStyles = (
    size: 'small' | 'middle' | 'large' = 'middle',
    bordered: boolean = false,
    className: string = ''
) => {
    const sizeStyles = {
        small: css`
            font-size: 0.875rem;
        `,
        middle: css`
            font-size: 1rem;
        `,
        large: css`
            font-size: 1.125rem;
        `
    };

    return css`
        position: relative;
        background-color: #ffffff;
        border-radius: 0.5rem;
        overflow: hidden;
        
        ${sizeStyles[size]}
        
        ${bordered && css`
            border: 1px solid #e5e7eb;
        `}
        
        ${className}
    `;
};

/**
 * Create table toolbar styles
 */
export const createTableToolbarStyles = () => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    
    .toolbar-left {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .toolbar-right {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
`;

/**
 * Create search input styles
 */
export const createSearchInputStyles = () => css`
    position: relative;
    
    .search-input {
        width: 250px;
        padding: 0.5rem 2.5rem 0.5rem 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        
        &:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 1px #3b82f6;
        }
    }
    
    .search-icon {
        position: absolute;
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        color: #6b7280;
        pointer-events: none;
    }
`;

/**
 * Create filter dropdown styles
 */
export const createFilterDropdownStyles = () => css`
    position: relative;
    
    .filter-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        background-color: #ffffff;
        color: #374151;
        font-size: 0.875rem;
        cursor: pointer;
        
        &:hover {
            background-color: #f9fafb;
        }
        
        &.active {
            background-color: #3b82f6;
            color: #ffffff;
            border-color: #3b82f6;
        }
    }
    
    .filter-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 1000;
        background-color: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        padding: 0.75rem;
        min-width: 200px;
        margin-top: 0.25rem;
        
        .filter-item {
            margin-bottom: 0.75rem;
            
            &:last-child {
                margin-bottom: 0;
            }
            
            .filter-label {
                display: block;
                font-size: 0.75rem;
                font-weight: 500;
                color: #374151;
                margin-bottom: 0.25rem;
            }
            
            .filter-input,
            .filter-select {
                width: 100%;
                padding: 0.375rem 0.5rem;
                border: 1px solid #d1d5db;
                border-radius: 0.25rem;
                font-size: 0.875rem;
                
                &:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 1px #3b82f6;
                }
            }
        }
        
        .filter-actions {
            display: flex;
            gap: 0.5rem;
            justify-content: flex-end;
            margin-top: 0.75rem;
            padding-top: 0.75rem;
            border-top: 1px solid #e5e7eb;
            
            button {
                padding: 0.25rem 0.75rem;
                border: 1px solid #d1d5db;
                border-radius: 0.25rem;
                background-color: #ffffff;
                cursor: pointer;
                font-size: 0.75rem;
                
                &:hover {
                    background-color: #f9fafb;
                }
                
                &.primary {
                    background-color: #3b82f6;
                    color: #ffffff;
                    border-color: #3b82f6;
                    
                    &:hover {
                        background-color: #2563eb;
                    }
                }
            }
        }
    }
`;

/**
 * Create export button styles
 */
export const createExportButtonStyles = () => css`
    position: relative;
    
    .export-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        background-color: #ffffff;
        color: #374151;
        font-size: 0.875rem;
        cursor: pointer;
        
        &:hover {
            background-color: #f9fafb;
        }
    }
    
    .export-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        z-index: 1000;
        background-color: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        padding: 0.5rem;
        min-width: 120px;
        margin-top: 0.25rem;
        
        .export-option {
            display: block;
            width: 100%;
            padding: 0.5rem 0.75rem;
            border: none;
            background-color: transparent;
            color: #374151;
            font-size: 0.875rem;
            text-align: left;
            cursor: pointer;
            border-radius: 0.25rem;
            
            &:hover {
                background-color: #f3f4f6;
            }
        }
    }
`;

/**
 * Create table styles
 */
export const createTableStyles = (
    size: 'small' | 'middle' | 'large' = 'middle'
) => {
    const paddingStyles = {
        small: '0.5rem 0.75rem',
        middle: '0.75rem 1rem',
        large: '1rem 1.25rem'
    };

    return css`
        width: 100%;
        border-collapse: collapse;
        
        thead {
            background-color: #f9fafb;
            border-bottom: 1px solid #e5e7eb;
            
            th {
                padding: ${paddingStyles[size]};
                font-weight: 600;
                color: #374151;
                text-align: left;
                border-right: 1px solid #e5e7eb;
                
                &:last-child {
                    border-right: none;
                }
                
                &.sortable {
                    cursor: pointer;
                    user-select: none;
                    
                    &:hover {
                        background-color: #f3f4f6;
                    }
                }
                
                &.sorted-asc::after {
                    content: ' ↑';
                    color: #3b82f6;
                }
                
                &.sorted-desc::after {
                    content: ' ↓';
                    color: #3b82f6;
                }
            }
        }
        
        tbody {
            tr {
                border-bottom: 1px solid #f3f4f6;
                transition: background-color 0.2s ease;
                
                &:hover {
                    background-color: #f9fafb;
                }
                
                &.selected {
                    background-color: #eff6ff;
                }
            }
            
            td {
                padding: ${paddingStyles[size]};
                color: #374151;
                border-right: 1px solid #f3f4f6;
                
                &:last-child {
                    border-right: none;
                }
            }
        }
    `;
};

/**
 * Create pagination styles
 */
export const createPaginationStyles = (
    size: 'small' | 'middle' | 'large' = 'middle'
) => {
    const sizeStyles = {
        small: css`
            padding: 0.5rem;
            font-size: 0.75rem;
        `,
        middle: css`
            padding: 0.75rem;
            font-size: 0.875rem;
        `,
        large: css`
            padding: 1rem;
            font-size: 1rem;
        `
    };

    return css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        background-color: #ffffff;
        border-top: 1px solid #e5e7eb;
        
        ${sizeStyles[size]}
        
        .pagination-info {
            color: #6b7280;
        }
        
        .pagination-controls {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .pagination-button {
            padding: 0.25rem 0.5rem;
            border: 1px solid #d1d5db;
            background-color: #ffffff;
            color: #374151;
            border-radius: 0.25rem;
            cursor: pointer;
            
            &:hover:not(:disabled) {
                background-color: #f9fafb;
            }
            
            &:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            &.active {
                background-color: #3b82f6;
                color: #ffffff;
                border-color: #3b82f6;
            }
        }
        
        .page-size-selector {
            padding: 0.25rem 0.5rem;
            border: 1px solid #d1d5db;
            border-radius: 0.25rem;
            background-color: #ffffff;
        }
    `;
};

/**
 * Create loading overlay styles
 */
export const createLoadingOverlayStyles = () => css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    
    .spinner {
        width: 2rem;
        height: 2rem;
        border: 2px solid #e5e7eb;
        border-top: 2px solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

/**
 * Create empty state styles
 */
export const createEmptyStateStyles = () => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    color: #6b7280;
    
    .empty-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }
    
    .empty-title {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }
    
    .empty-description {
        font-size: 0.875rem;
        text-align: center;
    }
`;
