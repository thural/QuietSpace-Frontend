/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

/**
 * Create chart container styles
 */
export const createChartContainerStyles = (
    width: number | string,
    height: number | string,
    responsive: boolean = false,
    className: string = ''
) => css`
    position: relative;
    width: ${typeof width === 'number' ? `${width}px` : width || '100%'};
    height: ${typeof height === 'number' ? `${height}px` : height || '400px'};
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow: hidden;
    
    ${responsive && css`
        width: 100%;
        height: auto;
        aspect-ratio: 16/9;
        
        @media (max-width: 768px) {
            aspect-ratio: 4/3;
        }
        
        @media (max-width: 480px) {
            aspect-ratio: 1/1;
        }
    `}
    
    ${className}
`;

/**
 * Create chart canvas styles
 */
export const createChartCanvasStyles = () => css`
    width: 100%;
    height: 100%;
    display: block;
`;

/**
 * Create chart loading overlay styles
 */
export const createLoadingOverlayStyles = () => css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.9);
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
 * Create chart error styles
 */
export const createChartErrorStyles = () => css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fef2f2;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    
    .error-content {
        text-align: center;
        color: #dc2626;
        
        .error-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        
        .error-title {
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 0.25rem;
        }
        
        .error-message {
            font-size: 0.875rem;
            color: #7f1d1d;
        }
    }
`;

/**
 * Create chart tooltip styles
 */
export const createTooltipStyles = () => css`
    position: absolute;
    background-color: rgba(0, 0, 0, 0.8);
    color: #ffffff;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    pointer-events: none;
    z-index: 20;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    
    .tooltip-title {
        font-weight: 600;
        margin-bottom: 0.25rem;
    }
    
    .tooltip-value {
        font-size: 0.75rem;
        opacity: 0.9;
    }
`;

/**
 * Create chart legend styles
 */
export const createLegendStyles = (
    position: 'top' | 'bottom' | 'left' | 'right' = 'bottom',
    orientation: 'horizontal' | 'vertical' = 'horizontal'
) => {
    const positionStyles = {
        top: css`top: 0; left: 0; right: 0;`,
        bottom: css`bottom: 0; left: 0; right: 0;`,
        left: css`left: 0; top: 0; bottom: 0;`,
        right: css`right: 0; top: 0; bottom: 0;`
    };

    const orientationStyles = {
        horizontal: css`
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            padding: 0.75rem;
        `,
        vertical: css`
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            gap: 0.5rem;
            padding: 0.75rem;
        `
    };

    return css`
        position: absolute;
        ${positionStyles[position]}
        background-color: rgba(255, 255, 255, 0.95);
        border: 1px solid #e5e7eb;
        ${orientationStyles[orientation]}
        
        .legend-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
            color: #374151;
            
            .legend-color {
                width: 0.75rem;
                height: 0.75rem;
                border-radius: 0.125rem;
                flex-shrink: 0;
            }
            
            .legend-label {
                font-weight: 500;
            }
        }
    `;
};

/**
 * Create chart grid styles
 */
export const createGridStyles = () => css`
    stroke: #e5e7eb;
    stroke-width: 1;
    stroke-dasharray: 2, 2;
    opacity: 0.5;
`;

/**
 * Create chart axis styles
 */
export const createAxisStyles = () => css`
    stroke: #6b7280;
    stroke-width: 1;
    
    .axis-label {
        fill: #374151;
        font-size: 0.875rem;
        font-weight: 500;
    }
    
    .axis-tick {
        fill: #6b7280;
        font-size: 0.75rem;
    }
`;

/**
 * Create chart data point styles
 */
export const createDataPointStyles = (
    color: string,
    size: number = 4,
    hovered: boolean = false
) => css`
    fill: ${color};
    stroke: ${color};
    stroke-width: 2;
    r: ${hovered ? size + 2 : size}px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        r: ${size + 3}px;
        stroke-width: 3;
    }
`;

/**
 * Create chart line styles
 */
export const createLineStyles = (
    color: string,
    strokeWidth: number = 2,
    strokeOpacity: number = 1,
    dashArray?: string
) => css`
    stroke: ${color};
    stroke-width: ${strokeWidth}px;
    stroke-opacity: ${strokeOpacity};
    fill: none;
    ${dashArray && css`stroke-dasharray: ${dashArray};`}
    transition: all 0.2s ease;
`;

/**
 * Create chart area styles
 */
export const createAreaStyles = (
    color: string,
    fillOpacity: number = 0.3
) => css`
    fill: ${color};
    fill-opacity: ${fillOpacity};
    stroke: none;
    transition: all 0.2s ease;
`;

/**
 * Create chart bar styles
 */
export const createBarStyles = (
    color: string,
    hovered: boolean = false
) => css`
    fill: ${color};
    stroke: ${color};
    stroke-width: 1;
    cursor: pointer;
    transition: all 0.2s ease;
    opacity: ${hovered ? 0.8 : 1};
    
    &:hover {
        opacity: 0.7;
        filter: brightness(1.1);
    }
`;
