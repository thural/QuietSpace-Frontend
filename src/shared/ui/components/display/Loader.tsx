/**
 * Enterprise Loader Component
 * 
 * A loader/spinner component that replaces the original Loader component
 * with enhanced theme integration and enterprise patterns.
 */

import React from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';

// Styled components
const LoaderContainer = styled.div<{ theme: any }>`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div<{ theme: any; size?: string; color?: string }>`
  width: ${props => props.size || '30px'};
  height: ${props => props.size || '30px'};
  border: 3px solid ${props => props.theme.colors?.backgroundSecondary || '#f0f0f0'};
  border-top: 3px solid ${props => props.color || props.theme.colors?.primary || '#007bff'};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Props interfaces
export interface LoaderProps extends BaseComponentProps {
    size?: string | number;
    color?: string;
}

// Main Loader component
export const Loader: React.FC<LoaderProps> = ({
    size = 'md',
    color,
    className,
    testId,
    ...props
}) => {
    // Convert size variants to actual pixel values
    const getSizePixels = (size: string | number) => {
        const sizeMap: Record<string, string> = {
            xs: '16px',
            sm: '24px',
            md: '30px',
            lg: '40px',
            xl: '48px'
        };

        if (typeof size === 'number') return `${size}px`;
        return sizeMap[size] || size;
    };

    const finalSize = getSizePixels(size);

    return (
        <LoaderContainer
            className={className}
            data-testid={testId}
            {...props}
        >
            <Spinner
                size={finalSize}
                color={color}
            />
        </LoaderContainer>
    );
};

Loader.displayName = 'Loader';

export default Loader;
