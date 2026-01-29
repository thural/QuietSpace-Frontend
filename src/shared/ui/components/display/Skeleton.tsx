/**
 * Enterprise Skeleton Component
 * 
 * A skeleton loading component that replaces the original Skeleton component
 * with enhanced theme integration and enterprise patterns.
 */

import React from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';

// Styled components
const SkeletonContainer = styled.div<{ theme: any; width?: string; height?: string; radius?: string }>`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '20px'};
  border-radius: ${props => props.radius || '4px'};
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors?.backgroundSecondary || '#f0f0f0'} 25%,
    ${props => props.theme.colors?.backgroundTertiary || '#e0e0e0'} 50%,
    ${props => props.theme.colors?.backgroundSecondary || '#f0f0f0'} 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  
  @keyframes skeleton-loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

// Props interfaces
export interface SkeletonProps extends BaseComponentProps {
    width?: string | number;
    height?: string | number;
    radius?: string;
    visible?: boolean;
}

// Main Skeleton component
export const Skeleton: React.FC<SkeletonProps> = ({
    width,
    height,
    radius = '4px',
    visible = true,
    className,
    testId,
    ...props
}) => {
    // Convert numeric dimensions to strings
    const widthValue = typeof width === 'number' ? `${width}px` : width;
    const heightValue = typeof height === 'number' ? `${height}px` : height;

    if (!visible) return null;

    return (
        <SkeletonContainer
            className={className}
            data-testid={testId}
            width={widthValue}
            height={heightValue}
            radius={radius}
            {...props}
        />
    );
};

Skeleton.displayName = 'Skeleton';

export default Skeleton;
