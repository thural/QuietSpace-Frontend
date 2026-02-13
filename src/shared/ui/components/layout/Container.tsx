/**
 * Enterprise Container Component
 * 
 * A flexible container component that replaces the original Box component
 * with enhanced theme integration and enterprise patterns.
 */

import { PureComponent, ReactNode, RefObject } from 'react';
import styled from 'styled-components';
import { LayoutProps } from '../types';
import { ComponentSize } from '../../utils/themeTokenHelpers';
import { getSpacing } from '../utils';

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
          padding-left: ${getSpacing(props.theme, 'lg')};
          padding-right: ${getSpacing(props.theme, 'lg')};
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
  
  /* Size-based margin using theme tokens */
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
    ${props => props.variant === 'constrained' && `
      padding-left: ${getSpacing(props.theme, 'md')};
      padding-right: ${getSpacing(props.theme, 'md')};
    `}
  }
`;

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
                styles.maxWidth = theme?.breakpoints?.xl || '1280px';
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
        } = this.props;

        const containerStyles = { ...this.getContainerStyles(theme), ...style };

        return (
            <StyledContainer
                ref={ref}
                variant={variant || 'default'}
                size={size || 'md'}
                padding={padding}
                margin={margin}
                theme={theme}
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

(Container as any).displayName = 'Container';

export default Container;
