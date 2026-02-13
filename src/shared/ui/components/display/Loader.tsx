/**
 * Enterprise Loader Component
 * 
 * A loader/spinner component that replaces the original Loader component
 * with enhanced theme integration and enterprise patterns.
 */

import { PureComponent, ReactNode } from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';
import { ComponentSize } from '../../utils/themeTokenHelpers';
import { getSpacing, getColor, getBorderWidth, getTransition } from '../utils';

// Styled components with theme token integration
const LoaderContainer = styled.div<{ theme?: any }>`
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface SpinnerProps {
    $size?: string;
    $color?: string;
    $borderWidth?: string;
    theme?: any;
}

const Spinner = styled.div<SpinnerProps>`
  width: ${props => props.$size || '30px'};
  height: ${props => props.$size || '30px'};
  border: ${props => props.$borderWidth || '3px'} solid ${props => getColor(props.theme, 'background.secondary')};
  border-top: ${props => props.$borderWidth || '3px'} solid ${props => props.$color || getColor(props.theme, 'brand.500')};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  transition: ${props => getTransition(props.theme, 'all', 'normal', 'ease')};
  
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
    borderWidth?: string;
    ref?: React.RefObject<HTMLDivElement>;
    id?: string;
    theme?: any;
}

// Main Loader component
class Loader extends PureComponent<ILoaderProps> {
    static defaultProps: Partial<ILoaderProps> = {
        size: 'md',
        variant: 'md'
    };

    // Size mapping using theme tokens
    private readonly sizeMap: Record<string, string> = {
        xs: '16px',
        sm: '24px',
        md: '30px',
        lg: '40px',
        xl: '48px'
    };

    // Size mapping for variant prop using theme tokens
    private readonly variantSizeMap: Record<ComponentSize, string> = {
        xs: '16px',
        sm: '24px',
        md: '30px',
        lg: '40px',
        xl: '48px'
    };

    // Border width mapping using theme tokens
    private readonly borderWidthMap: Record<string, string> = {
        thin: '1px',
        normal: '3px',
        thick: '4px'
    };

    // Get size using theme tokens
    private getSize = (theme: any, size: string | number | ComponentSize | undefined): string => {
        if (typeof size === 'number') return getSpacing(theme, size);
        if (typeof size === 'string' && this.sizeMap[size]) return getSpacing(theme, this.sizeMap[size]);
        if (size && this.variantSizeMap[size as ComponentSize]) return getSpacing(theme, this.variantSizeMap[size as ComponentSize]);
        return getSpacing(theme, this.sizeMap.md);
    };

    // Get border width using theme tokens
    private getBorderWidth = (theme: any, borderWidth?: string): string => {
        if (borderWidth && this.borderWidthMap[borderWidth]) {
            return getBorderWidth(theme, this.borderWidthMap[borderWidth]);
        }
        if (borderWidth) {
            return getBorderWidth(theme, borderWidth);
        }
        return getBorderWidth(theme, 'sm');
    };

    // Get color using theme tokens
    private getSpinnerColor = (theme: any, color?: string): string => {
        if (color) return getColor(theme, color);
        return getColor(theme, 'brand.500');
    };

    override render(): ReactNode {
        const { size, color, variant, borderWidth, className, testId, theme, ...props } = this.props;

        // Use variant prop first, then size prop, then default
        const finalSize = variant ? this.getSize(theme, variant) : this.getSize(theme, size);
        const finalColor = this.getSpinnerColor(theme, color);
        const finalBorderWidth = this.getBorderWidth(theme, borderWidth || 'normal');

        return (
            <LoaderContainer
                className={className}
                data-testid={testId}
                theme={theme}
                {...props}
            >
                <Spinner
                    $size={finalSize}
                    $color={finalColor}
                    $borderWidth={finalBorderWidth}
                    theme={theme}
                />
            </LoaderContainer>
        );
    }
}

// Set display name for debugging
(Loader as any).displayName = 'Loader';

export default Loader;
