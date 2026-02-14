/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { css } from '@emotion/react';
import { FlexProps } from '../types';
import { ComponentSize } from '../../utils/themeTokenHelpers';
import { getSpacing, getBreakpoint } from '../utils';

// Emotion CSS implementation with theme token integration
const getFlexContainerStyles = (theme?: any, props?: any) => {
    const { direction, wrap, justify, align, gap, padding, margin } = props || {};

    const baseStyles = css`
    box-sizing: border-box;
    display: flex;
    font-family: ${theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
    flex-direction: ${direction || 'row'};
    flex-wrap: ${wrap || 'nowrap'};
    justify-content: ${justify || 'flex-start'};
    align-items: ${align || 'stretch'};
  `;

    const gapStyles = gap && typeof gap === 'string' && css`
    gap: ${gap};
  `;

    const gapSizeStyles = gap && typeof gap !== 'string' && css`
    gap: ${gap === 'xs' ? getSpacing(theme, 'xs') : gap === 'sm' ? getSpacing(theme, 'sm') : gap === 'md' ? getSpacing(theme, 'md') : gap === 'lg' ? getSpacing(theme, 'lg') : gap === 'xl' ? getSpacing(theme, 'xl') : ''};
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
      flex-direction: ${(direction === 'row' || direction === 'row-reverse') ? 'column' : direction || 'column'};
      gap: ${gap && typeof gap === 'string' ? gap : gap && typeof gap !== 'string' ? (gap === 'xs' ? getSpacing(theme, 'xs') : gap === 'sm' ? getSpacing(theme, 'sm') : gap === 'md' ? getSpacing(theme, 'md') : gap === 'lg' ? getSpacing(theme, 'lg') : gap === 'xl' ? getSpacing(theme, 'xl') : '') : getSpacing(theme, 'sm')};
    }
  `;

    return css`
    ${baseStyles}
    ${gapStyles}
    ${gapSizeStyles}
    ${paddingStyles}
    ${paddingSizeStyles}
    ${marginStyles}
    ${marginSizeStyles}
    ${responsiveStyles}
  `;
};

interface IFlexContainerProps extends FlexProps {
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    gap?: ComponentSize | string;
    padding?: ComponentSize | string;
    margin?: ComponentSize | string;
    theme?: any;
}

/**
 * FlexContainer Component
 * 
 * A powerful flexbox container that provides comprehensive flexbox
 * utilities for creating flexible and responsive layouts.
 * Built using enterprise class-based pattern with theme token integration.
 */
export class FlexContainer extends PureComponent<IFlexContainerProps> {
    static defaultProps: Partial<IFlexContainerProps> = {
        direction: 'row',
        wrap: 'nowrap',
        justify: 'flex-start',
        align: 'stretch'
    };

    /**
     * Get flex styles based on props and theme tokens
     */
    private getFlexStyles = (): React.CSSProperties => {
        const { direction, wrap, justify, align } = this.props;
        const styles: React.CSSProperties = {};

        // Apply flex properties
        if (direction) styles.flexDirection = direction;
        if (wrap) styles.flexWrap = wrap;
        if (justify) styles.justifyContent = justify;
        if (align) styles.alignItems = align;

        return styles;
    };

    override render(): ReactNode {
        const {
            children,
            direction,
            wrap,
            justify,
            align,
            gap,
            padding,
            margin,
            className,
            testId,
            onClick,
            style,
            theme
        } = this.props;

        const flexStyles = { ...this.getFlexStyles(), ...style };

        const containerProps: any = {
            direction: direction || 'row',
            wrap: wrap || 'nowrap',
            justify: justify || 'flex-start',
            align: align || 'stretch',
            gap,
            padding,
            margin,
            theme,
            className,
            'data-testid': testId,
            onClick,
            style: flexStyles
        };

        return (
            <div
                css={getFlexContainerStyles(theme, { direction, wrap, justify, align, gap, padding, margin })}
                className={className}
                data-testid={testId}
                onClick={onClick}
                style={flexStyles}
            >
                {children}
            </div>
        );
    }
}

// Set display name for debugging
(FlexContainer as any).displayName = 'FlexContainer';

export default FlexContainer;
