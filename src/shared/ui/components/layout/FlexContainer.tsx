/**
 * Enterprise FlexContainer Component
 * 
 * A flexible container component that replaces the original Flex component
 * with enhanced theme integration and enterprise patterns.
 */

import React from 'react';
import styled from 'styled-components';
import { FlexProps } from '../types';
import { flexPropsToStyles } from '../utils';

// Styled component implementation
const StyledFlexContainer = styled.div<{ theme: any; $props: FlexProps }>`
  box-sizing: border-box;
  display: flex;
  ${(props) => flexPropsToStyles(props.$props, props.theme)}
`;

/**
 * FlexContainer Component
 * 
 * A powerful flexbox container that provides comprehensive flexbox
 * utilities for creating flexible and responsive layouts.
 * 
 * @param props - Flex props for flexbox styling and positioning
 * @returns JSX Element
 */
export const FlexContainer: React.FC<FlexProps> = (props) => {
    const { children, theme, className, testId, onClick, ...flexProps } = props;

    return (
        <StyledFlexContainer
            theme={theme}
            $props={flexProps}
            className={className}
            data-testid={testId}
            onClick={onClick}
        >
            {children}
        </StyledFlexContainer>
    );
};

FlexContainer.displayName = 'FlexContainer';

export default FlexContainer;
