/**
 * Enterprise Skeleton Component
 * 
 * A skeleton loading component that replaces the original Skeleton component
 * with enhanced theme integration and enterprise patterns.
 */

import React, { PureComponent, ReactNode } from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';
import { ComponentSize } from '../../utils/themeTokenHelpers';

// Styled components with theme token integration
interface SkeletonContainerProps {
  width?: string | undefined;
  height?: string | undefined;
  radius?: string | undefined;
  variant?: 'text' | 'rectangular' | 'circular' | undefined;
  size?: ComponentSize | undefined;
  theme?: any;
}

const SkeletonContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['variant', 'size'].includes(prop),
}) <SkeletonContainerProps>`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '20px'};
  border-radius: ${props => {
    if (props.variant === 'circular') return '50%';
    if (props.variant === 'text') return props.theme?.radius?.sm || '4px';
    return props.radius || props.theme?.radius?.md || '6px';
  }};
  
  /* Size-based dimensions using theme tokens */
  ${props => {
    if (props.size) {
      const sizeMap = {
        xs: { width: props.theme?.spacing?.xs || '4px', height: props.theme?.spacing?.xs || '4px' },
        sm: { width: props.theme?.spacing?.sm || '8px', height: props.theme?.spacing?.sm || '8px' },
        md: { width: props.theme?.spacing?.md || '16px', height: props.theme?.spacing?.md || '16px' },
        lg: { width: props.theme?.spacing?.lg || '24px', height: props.theme?.spacing?.lg || '24px' },
        xl: { width: props.theme?.spacing?.xl || '32px', height: props.theme?.spacing?.xl || '32px' }
      };
      const dimensions = sizeMap[props.size];
      if (dimensions) {
        return `
          width: ${dimensions.width};
          height: ${dimensions.height};
        `;
      }
    }

    if (props.variant === 'text') {
      return `
        height: ${props.theme?.typography?.fontSize?.base || '16px'};
        width: 60%;
        margin-bottom: ${props.theme?.spacing?.sm || '8px'};
      `;
    }

    return '';
  }}
  
  /* Skeleton gradient using theme tokens */
  background: linear-gradient(
    90deg,
    ${props => props.theme?.colors?.background?.secondary || '#f8f9fa'} 25%,
    ${props => props.theme?.colors?.background?.tertiary || '#e9ecef'} 50%,
    ${props => props.theme?.colors?.background?.secondary || '#f8f9fa'} 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading ${props => props.theme?.animation?.duration?.slow || '1.5s'} ${props => props.theme?.animation?.easing?.ease || 'ease'} infinite;
  
  @keyframes skeleton-loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
  
  /* Subtle animation on hover */
  &:hover {
    opacity: 0.8;
  }
`;

// Props interfaces
interface ISkeletonProps extends Omit<BaseComponentProps, 'ref' | 'id'> {
  width?: string | number;
  height?: string | number;
  radius?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  size?: ComponentSize;
  visible?: boolean;
  ref?: React.RefObject<HTMLDivElement>;
  id?: string;
}

// Main Skeleton component
class Skeleton extends PureComponent<ISkeletonProps> {
  static defaultProps: Partial<ISkeletonProps> = {
    variant: 'rectangular',
    visible: true
  };

  // Convert numeric dimensions to strings
  private convertDimension = (value: string | number | undefined): string | undefined => {
    if (typeof value === 'number') return `${value}px`;
    return value;
  };

  // Get default dimensions based on variant
  private getDefaultDimensions = (variant?: string): { width?: string; height?: string } => {
    switch (variant) {
      case 'text':
        return { width: '60%', height: '1em' };
      case 'circular':
        return { width: '40px', height: '40px' };
      case 'rectangular':
      default:
        return { width: '100%', height: '20px' };
    }
  };

  override render(): ReactNode {
    const {
      width,
      height,
      radius,
      variant,
      size,
      visible,
      className,
      testId,
      ...props
    } = this.props;

    if (!visible) return null;

    const widthValue = this.convertDimension(width);
    const heightValue = this.convertDimension(height);
    const defaultDimensions = this.getDefaultDimensions(variant);

    const containerProps: any = {
      className,
      'data-testid': testId,
      width: widthValue || defaultDimensions.width,
      height: heightValue || defaultDimensions.height,
      radius,
      variant: variant || 'rectangular',
      size,
      ...props
    };

    return <SkeletonContainer {...containerProps} />;
  }
}

// Set display name for debugging
(Skeleton as any).displayName = 'Skeleton';

export default Skeleton;
