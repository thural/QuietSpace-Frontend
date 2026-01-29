/**
 * Enterprise Container Component
 * 
 * A flexible container component that replaces the original Box component
 * with enhanced theme integration and enterprise patterns.
 */

import React from 'react';
import styled from 'styled-components';
import { LayoutProps } from '../types';
import { layoutPropsToStyles } from '../utils';

// Styled component implementation
const StyledContainer = styled.div<{ theme: any; $props: LayoutProps }>`
  box-sizing: border-box;
  ${(props) => layoutPropsToStyles(props.$props, props.theme)}
`;

/**
 * Container Component
 * 
 * A versatile layout container that provides consistent spacing,
 * positioning, and layout utilities across the application.
 * 
 * @param props - Layout props for styling and positioning
 * @returns JSX Element
 */
export const Container = React.forwardRef<HTMLDivElement, LayoutProps>((props, ref) => {
    const { children, theme, className, testId, id, onClick, style, ...layoutProps } = props;

    return (
        <StyledContainer
            ref={ref}
            theme={theme}
            $props={layoutProps}
            className={className}
            id={id?.toString()}
            data-testid={testId}
            onClick={onClick}
            style={style}
        >
            {children}
        </StyledContainer>
    );
});

Container.displayName = 'Container';

export default Container;
