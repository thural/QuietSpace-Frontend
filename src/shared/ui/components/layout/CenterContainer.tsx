/**
 * Enterprise CenterContainer Component
 * 
 * A centering container component that replaces the original Center component
 * with enhanced theme integration and enterprise patterns.
 */

import React from 'react';
import styled from 'styled-components';
import { LayoutProps } from '../types';
import { layoutPropsToStyles } from '../utils';

// Styled component implementation
const StyledCenterContainer = styled.div<{ theme: any; $props: LayoutProps }>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  ${(props) => layoutPropsToStyles(props.$props, props.theme)}
`;

/**
 * CenterContainer Component
 * 
 * A specialized container that centers its content both horizontally
 * and vertically using flexbox. Perfect for modals, overlays, and
 * centered layouts.
 * 
 * @param props - Layout props for styling and positioning
 * @returns JSX Element
 */
export const CenterContainer: React.FC<LayoutProps> = (props) => {
    const { children, theme, className, testId, ...layoutProps } = props;

    return (
        <StyledCenterContainer
            theme={theme}
            $props={layoutProps}
            className={className}
            data-testid={testId}
        >
            {children}
        </StyledCenterContainer>
    );
};

CenterContainer.displayName = 'CenterContainer';

export default CenterContainer;
