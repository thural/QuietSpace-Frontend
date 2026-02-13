/**
 * Enterprise FlexContainer Component
 * 
 * A flexible container component that replaces the original Flex component
 * with enhanced theme integration and enterprise patterns.
 */

import { PureComponent, ReactNode } from 'react';
import styled from 'styled-components';
import { FlexProps } from '../types';
import { ComponentSize } from '../../utils/themeTokenHelpers';
import { getSpacing } from '../utils';

// Styled components with theme token integration
const StyledFlexContainer = styled.div<{
    theme?: any;
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    gap?: ComponentSize | string;
    padding?: ComponentSize | string;
    margin?: ComponentSize | string;
}>`
  box-sizing: border-box;
  display: flex;
  font-family: ${props => props.theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
  
  /* Flex direction */
  flex-direction: ${props => props.direction || 'row'};
  
  /* Flex wrap */
  flex-wrap: ${props => props.wrap || 'nowrap'};
  
  /* Justify content */
  justify-content: ${props => props.justify || 'flex-start'};
  
  /* Align items */
  align-items: ${props => props.align || 'stretch'};
  
  /* Gap using theme spacing tokens */
  ${props => {
        if (props.gap && typeof props.gap === 'string') {
            const gapMap: Record<ComponentSize, string> = {
                xs: getSpacing(props.theme, 'xs'),
                sm: getSpacing(props.theme, 'sm'),
                md: getSpacing(props.theme, 'md'),
                lg: getSpacing(props.theme, 'lg'),
                xl: getSpacing(props.theme, 'xl')
            };
            if (gapMap[props.gap as ComponentSize]) {
                return `gap: ${gapMap[props.gap as ComponentSize]};`;
            }
            return `gap: ${props.gap};`;
        }
        return '';
    }}
  
  /* Padding using theme spacing tokens */
  ${props => {
        if (props.padding && typeof props.padding === 'string') {
            const paddingMap: Record<ComponentSize, string> = {
                xs: getSpacing(props.theme, 'xs'),
                sm: getSpacing(props.theme, 'sm'),
                md: getSpacing(props.theme, 'md'),
                lg: getSpacing(props.theme, 'lg'),
                xl: getSpacing(props.theme, 'xl')
            };
            if (paddingMap[props.padding as ComponentSize]) {
                return `padding: ${paddingMap[props.padding as ComponentSize]};`;
            }
            return `padding: ${props.padding};`;
        }
        return '';
    }}
  
  /* Margin using theme spacing tokens */
  ${props => {
        if (props.margin && typeof props.margin === 'string') {
            const marginMap: Record<ComponentSize, string> = {
                xs: getSpacing(props.theme, 'xs'),
                sm: getSpacing(props.theme, 'sm'),
                md: getSpacing(props.theme, 'md'),
                lg: getSpacing(props.theme, 'lg'),
                xl: getSpacing(props.theme, 'xl')
            };
            if (marginMap[props.margin as ComponentSize]) {
                return `margin: ${marginMap[props.margin as ComponentSize]};`;
            }
            return `margin: ${props.margin};`;
        }
        return '';
    }}
  
  /* Responsive design using theme breakpoints */
  @media (max-width: ${props => props.theme?.breakpoints?.sm || '768px'}) {
    flex-direction: ${props => (props.direction === 'row' || props.direction === 'row-reverse') ? 'column' : props.direction || 'column'};
    gap: ${props => {
        if (props.gap && typeof props.gap === 'string') {
            const gapMap: Record<ComponentSize, string> = {
                xs: getSpacing(props.theme, 'xs'),
                sm: getSpacing(props.theme, 'sm'),
                md: getSpacing(props.theme, 'md'),
                lg: getSpacing(props.theme, 'lg'),
                xl: getSpacing(props.theme, 'xl')
            };
            if (gapMap[props.gap as ComponentSize]) {
                return gapMap[props.gap as ComponentSize];
            }
            return props.gap;
        }
        return getSpacing(props.theme, 'sm');
    }};
  }
`;

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
            <StyledFlexContainer {...containerProps}>
                {children}
            </StyledFlexContainer>
        );
    }
}

// Set display name for debugging
(FlexContainer as any).displayName = 'FlexContainer';

export default FlexContainer;
