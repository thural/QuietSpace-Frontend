/**
 * Enterprise Title Component
 * 
 * A title component that replaces the original Title component
 * with enhanced theme integration and enterprise patterns.
 */

import React from 'react';
import styled from 'styled-components';
import { TypographyProps } from '../types';
import { typographyPropsToStyles } from '../utils';

// Styled component implementation
const StyledTitle = styled.h1<{ theme: any; $props: TypographyProps }>`
  margin: 0;
  box-sizing: border-box;
  font-weight: bold;
  ${(props) => typographyPropsToStyles(props.$props, props.theme)}
`;

/**
 * Title Component
 * 
 * A specialized heading component for titles and headings
 * with consistent styling and theme integration.
 * 
 * @param props - Typography props for title styling
 * @returns JSX Element
 */
export const Title: React.FC<TypographyProps> = (props) => {
    const { children, theme, className, testId, ...typographyProps } = props;

    return (
        <StyledTitle
            theme={theme}
            $props={typographyProps}
            className={className}
            data-testid={testId}
        >
            {children}
        </StyledTitle>
    );
};

Title.displayName = 'Title';

export default Title;
