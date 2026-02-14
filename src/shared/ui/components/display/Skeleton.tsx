/**
 * Enterprise Skeleton Component
 * 
 * A skeleton loading component that replaces the original Skeleton component
 * with enhanced theme integration and enterprise patterns.
 */

/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { css } from '@emotion/react';
import { BaseComponentProps } from '../types';
import { ComponentSize } from '../../utils/themeTokenHelpers';
import { getSpacing, getRadius, getTypography, getSkeletonStyles } from '../utils';

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

    // Size-based dimensions using theme tokens
    let sizeStyles = '';
    if (size) {
      const sizeMap = {
        xs: { width: getSpacing(theme, 'xs'), height: getSpacing(theme, 'xs') },
        sm: { width: getSpacing(theme, 'sm'), height: getSpacing(theme, 'sm') },
        md: { width: getSpacing(theme, 'md'), height: getSpacing(theme, 'md') },
        lg: { width: getSpacing(theme, 'lg'), height: getSpacing(theme, 'lg') },
        xl: { width: getSpacing(theme, 'xl'), height: getSpacing(theme, 'xl') }
      };
      const dimensions = sizeMap[size];
      if (dimensions) {
        sizeStyles = `
                    width: ${dimensions.width};
                    height: ${dimensions.height};
                `;
      }
    }

    // Text variant styles
    let textStyles = '';
    if (variant === 'text') {
      textStyles = `
                height: ${getTypography(theme, 'fontSize.base')};
                width: 60%;
                margin-bottom: ${getSpacing(theme, 'sm')};
            `;
    }

    // Border radius styles
    const getRadiusValue = () => {
      if (variant === 'circular') return getRadius(theme, 'round');
      if (variant === 'text') return getRadius(theme, 'sm');
      return getRadius(theme, radius || 'md');
    };

    const skeletonStyles = css`
            width: ${widthValue || defaultDimensions.width};
            height: ${heightValue || defaultDimensions.height};
            border-radius: ${getRadiusValue()};
            
            ${sizeStyles}
            ${textStyles}
            
            /* Use getSkeletonStyles utility for consistent skeleton appearance */
            ${getSkeletonStyles(theme || {} as any)}
            
            /* Subtle animation on hover */
            &:hover {
                opacity: 0.8;
            }
        `;

    return (
      <div
        css={skeletonStyles}
        className={className}
        data-testid={testId}
        {...props}
      />
    );
  }
}

// Set display name for debugging
(Skeleton as any).displayName = 'Skeleton';

export default Skeleton;
