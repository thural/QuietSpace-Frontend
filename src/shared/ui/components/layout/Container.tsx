/**
 * Enterprise Container Component
 * 
 * A flexible container component that replaces the original Box component
 * with enhanced theme integration and enterprise patterns.
 */

import React, { PureComponent, ReactNode, RefObject } from 'react';
import styled from 'styled-components';
import { LayoutProps } from '../types';
import { ComponentSize } from '../../utils/themeTokenHelpers';

// Styled components with theme token integration
const StyledContainer = styled.div<{
    theme?: any;
    variant?: 'default' | 'centered' | 'fluid' | 'constrained';
    size?: ComponentSize;
    padding?: ComponentSize | string;
    margin?: ComponentSize | string;
}>`
  box-sizing: border-box;
  font-family: ${props => props.theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
  
  /* Variant styles using theme tokens */
  ${props => {
        switch (props.variant) {
            case 'centered':
                return `
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        `;
            case 'fluid':
                return `
          width: 100%;
          max-width: none;
        `;
            case 'constrained':
                return `
          width: 100%;
          max-width: ${props.theme?.breakpoints?.xl || '1280px'};
          margin: 0 auto;
          padding-left: ${props.theme?.spacing?.lg || '24px'};
          padding-right: ${props.theme?.spacing?.lg || '24px'};
        `;
            default:
                return `
          position: relative;
        `;
        }
    }}
  
  /* Size-based padding using theme tokens */
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
  
  /* Size-based margin using theme tokens */
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
    ${props => props.variant === 'constrained' && `
      padding-left: ${props.theme?.spacing?.md || '16px'};
      padding-right: ${props.theme?.spacing?.md || '16px'};
    `}
  }
`;

interface IContainerProps extends LayoutProps {
    variant?: 'default' | 'centered' | 'fluid' | 'constrained';
    size?: ComponentSize;
    padding?: ComponentSize | string;
    margin?: ComponentSize | string;
    ref?: RefObject<HTMLDivElement>;
}

/**
 * Container Component
 * 
 * A versatile layout container that provides consistent spacing,
 * positioning, and layout utilities across the application.
 * Built using enterprise class-based pattern with theme token integration.
 */
export class Container extends PureComponent<IContainerProps> {
    static defaultProps: Partial<IContainerProps> = {
        variant: 'default'
    };

    /**
     * Get container styles based on props and theme tokens
     */
    private getContainerStyles = (): React.CSSProperties => {
        const { variant, size, padding, margin } = this.props;
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
                styles.maxWidth = '1280px';
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
            ...layoutProps
        } = this.props;

        const containerStyles = { ...this.getContainerStyles(), ...style };

        return (
            <StyledContainer
                ref={ref}
                variant={variant}
                size={size}
                padding={padding}
                margin={margin}
                className={className}
                id={id?.toString()}
                data-testid={testId}
                onClick={onClick}
                style={containerStyles}
            >
                {children}
            </StyledContainer>
        );
    }
}

Container.displayName = 'Container';

export default Container;
