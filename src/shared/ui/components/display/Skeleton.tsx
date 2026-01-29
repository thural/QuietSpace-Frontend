/**
 * Enterprise Skeleton Component
 * 
 * A skeleton loading component that replaces the original Skeleton component
 * with enhanced theme integration and enterprise patterns.
 */

import React, { PureComponent, ReactNode } from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';

// Styled components
interface SkeletonContainerProps {
  width?: string;
  height?: string;
  radius?: string;
}

const SkeletonContainer = styled.div<SkeletonContainerProps>`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '20px'};
  border-radius: ${props => props.radius || '4px'};
  background: linear-gradient(
    90deg,
    ${(props) => (props.theme as any)?.colors?.backgroundSecondary || '#f0f0f0'} 25%,
    ${(props) => (props.theme as any)?.colors?.backgroundTertiary || '#e0e0e0'} 50%,
    ${(props) => (props.theme as any)?.colors?.backgroundSecondary || '#f0f0f0'} 75%
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
interface ISkeletonProps extends Omit<BaseComponentProps, 'ref' | 'id'> {
  width?: string | number;
  height?: string | number;
  radius?: string;
  visible?: boolean;
  ref?: React.RefObject<HTMLDivElement>;
  id?: string;
}

// Main Skeleton component
class Skeleton extends PureComponent<ISkeletonProps> {
  static defaultProps: Partial<ISkeletonProps> = {
    radius: '4px',
    visible: true
  };

  // Convert numeric dimensions to strings
  private convertDimension = (value: string | number | undefined): string | undefined => {
    if (typeof value === 'number') return `${value}px`;
    return value;
  };

  render(): ReactNode {
    const {
      width,
      height,
      radius,
      visible,
      className,
      testId,
      ...props
    } = this.props;

    if (!visible) return null;

    const widthValue = this.convertDimension(width);
    const heightValue = this.convertDimension(height);

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
  }
}

// Set display name for debugging
(Skeleton as any).displayName = 'Skeleton';

export default Skeleton;
