/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode, RefObject } from 'react';
import { css } from '@emotion/react';
import { LayoutProps } from '../types';
import { ComponentSize } from '../../utils/themeTokenHelpers';
import { getSpacing, getBreakpoint } from '../utils';

// Emotion CSS implementation with theme token integration
const getContainerStyles = (theme?: any, props?: any) => {
    const { variant, size, padding, margin } = props || {};

    const variantStyles = css`
    font-family: ${theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
  `;

    const centeredStyles = variant === 'centered' && css`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  `;

    const fluidStyles = variant === 'fluid' && css`
    width: 100%;
    max-width: none;
  `;

    const constrainedStyles = variant === 'constrained' && css`
    width: 100%;
    max-width: ${theme?.breakpoints?.xl || getBreakpoint(theme, 'lg')};
    margin: 0 auto;
    padding-left: ${getSpacing(theme, 'lg')};
    padding-right: ${getSpacing(theme, 'lg')};
  `;

    const defaultStyles = !variant && css`
    position: relative;
  `;

    const paddingStyles = padding && typeof padding === 'string' && css`
    padding: ${padding};
  `;

    const paddingSizeStyles = padding && typeof padding !== 'string' && css`
    padding: ${padding === 'xs' ? getSpacing(theme, 'xs') : padding === 'sm' ? getSpacing(theme, 'sm') : padding === 'md' ? getSpacing(theme, 'md') : padding === 'lg' ? getSpacing(theme, 'lg') : padding === 'xl' ? getSpacing(theme, 'xl') : ''};
  `;

    const marginStyles = margin && typeof margin === 'string' && css`
    margin: ${margin};
  `;

    const marginSizeStyles = margin && typeof margin !== 'string' && css`
    margin: ${margin === 'xs' ? getSpacing(theme, 'xs') : margin === 'sm' ? getSpacing(theme, 'sm') : margin === 'md' ? getSpacing(theme, 'md') : margin === 'lg' ? getSpacing(theme, 'lg') : margin === 'xl' ? getSpacing(theme, 'xl') : ''};
  `;

    const responsiveStyles = css`
    @media (max-width: ${getBreakpoint(theme, 'sm')}) {
      ${variant === 'constrained' && css`
        padding-left: ${padding === 'xs' ? getSpacing(theme, 'xs') : padding === 'sm' ? getSpacing(theme, 'sm') : padding === 'md' ? getSpacing(theme, 'md') : padding === 'lg' ? getSpacing(theme, 'lg') : padding === 'xl' ? getSpacing(theme, 'xl') : ''};
        padding-right: ${padding === 'xs' ? getSpacing(theme, 'xs') : padding === 'sm' ? getSpacing(theme, 'sm') : padding === 'md' ? getSpacing(theme, 'md') : padding === 'lg' ? getSpacing(theme, 'lg') : padding === 'xl' ? getSpacing(theme, 'xl') : ''};
        padding-right: ${getSpacing(theme, 'md')};
      `}
    }
  `;

    return css`
    box-sizing: border-box;
    ${variantStyles}
    ${centeredStyles}
    ${fluidStyles}
    ${constrainedStyles}
    ${defaultStyles}
    ${paddingStyles}
    ${paddingSizeStyles}
    ${marginStyles}
    ${marginSizeStyles}
    ${responsiveStyles}
  `;
};

interface IContainerProps extends LayoutProps {
    variant?: 'default' | 'centered' | 'fluid' | 'constrained';
    size?: ComponentSize;
    padding?: ComponentSize | string;
    margin?: ComponentSize | string;
    ref?: RefObject<HTMLDivElement>;
    theme?: any;
}

/**
 * Container Component
 * 
 * A versatile layout container that provides consistent spacing,
 * positioning, and layout utilities across application.
 * Built using enterprise class-based pattern with theme token integration.
 */
export class Container extends PureComponent<IContainerProps> {
    static defaultProps: Partial<IContainerProps> = {
        variant: 'default'
    };

    /**
     * Get container styles based on props and theme tokens
     */
    private getContainerStyles = (theme: any): React.CSSProperties => {
        const { variant } = this.props;
        const styles: React.CSSProperties = {};

        // Apply variant-specific styles
        switch (variant) {
            case 'centered':
                styles.display = 'flex';
                styles.alignItems = 'center';
                styles.justifyContent = 'center';
                styles.margin = '0 auto';
                break;
            case 'fluid':
                styles.width = '100%';
                styles.maxWidth = 'none';
                break;
            case 'constrained':
                styles.width = '100%';
                styles.maxWidth = theme?.breakpoints?.xl || getBreakpoint(theme, 'lg');
                styles.margin = '0 auto';
                break;
        }

        return styles;
    };

    override render(): ReactNode {
        const {
            children,
            variant,
            size,
            padding,
            margin,
            className,
            testId,
            id,
            onClick,
            style,
            ref,
            theme
        } = this.props;

        const containerStyles = { ...this.getContainerStyles(theme), ...style };

        return (
            <div
                ref={ref}
                css={getContainerStyles(theme, { variant, size, padding, margin })}
                className={className}
                id={id?.toString()}
                data-testid={testId}
                onClick={onClick}
                style={containerStyles}
            >
                {children}
            </div>
        );
    }
}

(Container as any).displayName = 'Container';

export default Container;
