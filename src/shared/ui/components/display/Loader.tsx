/**
 * Enterprise Loader Component
 * 
 * A loader/spinner component that replaces the original Loader component
 * with enhanced theme integration and enterprise patterns.
 */

import React, { PureComponent, ReactNode } from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';

// Styled components
const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface SpinnerProps {
    size?: string;
    color?: string;
}

const Spinner = styled.div<SpinnerProps>`
  width: ${props => props.size || '30px'};
  height: ${props => props.size || '30px'};
  border: 3px solid ${(props) => (props.theme as any)?.colors?.backgroundSecondary || '#f0f0f0'};
  border-top: 3px solid ${props => props.color || (props.theme as any)?.colors?.primary || '#007bff'};
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
    ref?: React.RefObject<HTMLDivElement>;
    id?: string;
}

// Main Loader component
class Loader extends PureComponent<ILoaderProps> {
    static defaultProps: Partial<ILoaderProps> = {
        size: 'md'
    };

    // Size mapping for consistent sizing
    private readonly sizeMap: Record<string, string> = {
        xs: '16px',
        sm: '24px',
        md: '30px',
        lg: '40px',
        xl: '48px'
    };

    // Convert size variants to actual pixel values
    private getSizePixels = (size: string | number): string => {
        if (typeof size === 'number') return `${size}px`;
        return this.sizeMap[size] || size;
    };

    render(): ReactNode {
        const { size, color, className, testId, ...props } = this.props;
        const finalSize = this.getSizePixels(size || 'md');

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
    }
}

// Set display name for debugging
(Loader as any).displayName = 'Loader';

export default Loader;
