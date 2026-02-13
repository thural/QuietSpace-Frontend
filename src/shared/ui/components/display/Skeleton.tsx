/**
 * Enterprise Skeleton Component
 * 
 * A skeleton loading component that replaces the original Skeleton component
 * with enhanced theme integration and enterprise patterns.
 */

import { PureComponent, ReactNode } from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';
import { ComponentSize } from '../../utils/themeTokenHelpers';
import { getSpacing, getRadius, getTypography, getSkeletonStyles } from '../utils';

// Styled components with theme token integration
interface SkeletonContainerProps {
  $width?: string | undefined;
  $height?: string | undefined;
  $radius?: string | undefined;
  $variant?: 'text' | 'rectangular' | 'circular' | undefined;
  $size?: ComponentSize | undefined;
  theme?: any;
}

const SkeletonContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$variant', '$size'].includes(prop),
}) <SkeletonContainerProps>`n  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '20px'};
  border-radius: ${props => {
    if (props.$variant === 'circular') return getRadius(props.theme, 'round');
    if (props.$variant === 'text') return getRadius(props.theme, 'sm');
    return getRadius(props.theme, props.$radius || 'md');
  }};
  
  /* Size-based dimensions using theme tokens */
  ${props => {
    if (props.$size) {
      const sizeMap = {
        xs: { width: getSpacing(props.theme, 'xs'), height: getSpacing(props.theme, 'xs') },
        sm: { width: getSpacing(props.theme, 'sm'), height: getSpacing(props.theme, 'sm') },
        md: { width: getSpacing(props.theme, 'md'), height: getSpacing(props.theme, 'md') },
        lg: { width: getSpacing(props.theme, 'lg'), height: getSpacing(props.theme, 'lg') },
        xl: { width: getSpacing(props.theme, 'xl'), height: getSpacing(props.theme, 'xl') }
      };
      const dimensions = sizeMap[props.$size];
      if (dimensions) {
        return `
          width: ${dimensions.width};
          height: ${dimensions.height};
        `;
      }
    }

    if (props.$variant === 'text') {
      return `
        height: ${getTypography(props.theme, 'fontSize.base')};
        width: 60%;
        margin-bottom: ${getSpacing(props.theme, 'sm')};
      `;
    }

    return '';
  }}
  
  /* Use getSkeletonStyles utility for consistent skeleton appearance */
  ${props => getSkeletonStyles(props.theme || {} as any)}
  
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
  theme?: any;
}

// Main Skeleton component
class Skeleton extends PureComponent<ISkeletonProps> {
  static defaultProps: Partial<ISkeletonProps> = {
    variant: 'rectangular',
    visible: true
  };

  // Convert dimensions using theme tokens
  private convertDimension = (theme: any, value: string | number | undefined): string | undefined => {
    if (typeof value === 'number') return getSpacing(theme, value);
    return value;
  };

  // Get default dimensions using theme tokens
  private getDefaultDimensions = (theme: any, variant?: string): { width?: string; height?: string } => {
    switch (variant) {
      case 'text':
        return { width: '60%', height: getTypography(theme, 'fontSize.base') };
      case 'circular':
        return { width: getSpacing(theme, 40), height: getSpacing(theme, 40) };
      case 'rectangular':
      default:
        return { width: '100%', height: getSpacing(theme, 20) };
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
      theme,
      ...props
    } = this.props;

    if (!visible) return null;

    const widthValue = this.convertDimension(theme, width);
    const heightValue = this.convertDimension(theme, height);
    const defaultDimensions = this.getDefaultDimensions(theme, variant);

    const containerProps: any = {
      className,
      'data-testid': testId,
      $width: widthValue || defaultDimensions.width,
      $height: heightValue || defaultDimensions.height,
      $radius: radius,
      $variant: variant || 'rectangular',
      $size: size,
      theme,
      ...props
    };

    return <SkeletonContainer {...containerProps} />;
  }
}

// Set display name for debugging
(Skeleton as any).displayName = 'Skeleton';

export default Skeleton;
