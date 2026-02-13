/**
 * Enterprise FlexContainer Component
 * 
 * A flexible container component that replaces the original Flex component
 * with enhanced theme integration and enterprise patterns.
 */

import React, { PureComponent, ReactNode } from 'react';
import styled from 'styled-components';
import { FlexProps } from '../types';
import { ComponentSize } from '../../utils/themeTokenHelpers';

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
                xs: props.theme?.spacing?.xs || '4px',
                sm: props.theme?.spacing?.sm || '8px',
                md: props.theme?.spacing?.md || '16px',
                lg: props.theme?.spacing?.lg || '24px',
                xl: props.theme?.spacing?.xl || '32px'
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
                xs: props.theme?.spacing?.xs || '4px',
                sm: props.theme?.spacing?.sm || '8px',
                md: props.theme?.spacing?.md || '16px',
                lg: props.theme?.spacing?.lg || '24px',
                xl: props.theme?.spacing?.xl || '32px'
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
                xs: props.theme?.spacing?.xs || '4px',
                sm: props.theme?.spacing?.sm || '8px',
                md: props.theme?.spacing?.md || '16px',
                lg: props.theme?.spacing?.lg || '24px',
                xl: props.theme?.spacing?.xl || '32px'
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
                xs: props.theme?.spacing?.xs || '4px',
                sm: props.theme?.spacing?.sm || '8px',
                md: props.theme?.spacing?.md || '16px',
                lg: props.theme?.spacing?.lg || '24px',
                xl: props.theme?.spacing?.xl || '32px'
            };
            if (gapMap[props.gap as ComponentSize]) {
                return gapMap[props.gap as ComponentSize];
            }
            return props.gap;
        }
        return props.theme?.spacing?.sm || '8px';
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
            style
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
