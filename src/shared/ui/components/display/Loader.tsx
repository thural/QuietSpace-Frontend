/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { css, keyframes } from '@emotion/react';
import { BaseComponentProps } from '../types';
import { ComponentSize } from '../../utils/themeTokenHelpers';
import { getSpacing, getColor, getBorderWidth, getTransition } from '../utils';

// Emotion CSS utility functions
const spinKeyframes = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

const createLoaderContainerStyles = () => css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const createSpinnerStyles = (
    theme: any,
    size?: string,
    color?: string,
    borderWidth?: string
) => css`
  width: ${size || '30px'};
  height: ${size || '30px'};
  border: ${borderWidth || '3px'} solid ${getColor(theme, 'background.secondary')};
  border-top: ${borderWidth || '3px'} solid ${color || getColor(theme, 'brand.500')};
  border-radius: 50%;
  animation: ${spinKeyframes} 1s linear infinite;
  transition: ${getTransition(theme, 'all', 'normal', 'ease')};
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
            <div
                css={createLoaderContainerStyles()}
                className={className}
                data-testid={testId}
                {...props}
            >
                <div
                    css={createSpinnerStyles(theme || {} as any, finalSize, finalColor, finalBorderWidth)}
                />
            </div>
        );
    }
}

// Set display name for debugging
(Loader as any).displayName = 'Loader';

export default Loader;
