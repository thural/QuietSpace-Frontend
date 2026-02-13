/**
 * Enterprise Loader Component
 * 
 * A loader/spinner component that replaces the original Loader component
 * with enhanced theme integration and enterprise patterns.
 */

import React, { PureComponent, ReactNode } from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';
import { ComponentSize } from '../../utils/themeTokenHelpers';

// Styled components with theme token integration
const LoaderContainer = styled.div<{ theme?: any }>`
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface SpinnerProps {
    size?: string;
    color?: string;
    theme?: any;
}

const Spinner = styled.div<SpinnerProps>`
  width: ${props => props.size || '30px'};
  height: ${props => props.size || '30px'};
  border: 3px solid ${props => props.theme?.colors?.background?.secondary || props.theme?.colors?.backgroundSecondary || '#f0f0f0'};
  border-top: 3px solid ${props => props.color || props.theme?.colors?.primary || props.theme?.colors?.brand?.[500] || '#007bff'};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Props interfaces
interface ILoaderProps extends Omit<BaseComponentProps, 'ref' | 'id'> {
    size?: string | number;
    color?: string;
    variant?: ComponentSize;
    ref?: React.RefObject<HTMLDivElement>;
    id?: string;
}

// Main Loader component
class Loader extends PureComponent<ILoaderProps> {
    static defaultProps: Partial<ILoaderProps> = {
        size: 'md',
        variant: 'md'
    };

    // Size mapping for consistent sizing using theme tokens
    private readonly sizeMap: Record<string, string> = {
        xs: '16px',
        sm: '24px',
        md: '30px',
        lg: '40px',
        xl: '48px'
    };

    // Size mapping for variant prop
    private readonly variantSizeMap: Record<ComponentSize, string> = {
        xs: '16px',
        sm: '24px',
        md: '30px',
        lg: '40px',
        xl: '48px'
    };

    // Convert size variants to actual pixel values
    private getSizePixels = (size: string | number | ComponentSize | undefined): string => {
        if (typeof size === 'number') return `${size}px`;
        if (typeof size === 'string' && this.sizeMap[size]) return this.sizeMap[size];
        if (size && this.variantSizeMap[size as ComponentSize]) return this.variantSizeMap[size as ComponentSize];
        return this.sizeMap.md;
    };

    // Get color based on theme tokens or fallback
    private getSpinnerColor = (color?: string): string => {
        if (color) return color;
        // Return theme brand color or fallback
        return '#007bff';
    };

    override render(): ReactNode {
        const { size, color, variant, className, testId, ...props } = this.props;

        // Use variant prop first, then size prop, then default
        const finalSize = variant ? this.getSizePixels(variant) : this.getSizePixels(size);
        const finalColor = this.getSpinnerColor(color);

        return (
            <LoaderContainer
                className={className}
                data-testid={testId}
                {...props}
            >
                <Spinner
                    size={finalSize}
                    color={finalColor}
                />
            </LoaderContainer>
        );
    }
}

// Set display name for debugging
(Loader as any).displayName = 'Loader';

export default Loader;
