/**
 * Enterprise Text Component
 * 
 * A versatile text component that replaces the original Text component
 * with enhanced theme integration and enterprise patterns.
 */

import React, { PureComponent, ReactNode } from 'react';
import styled from 'styled-components';
import { TypographyProps } from '../types';
import { typographyPropsToStyles } from '../utils';

interface ITextProps extends TypographyProps {
    children?: ReactNode;
}

// Styled component implementation
const StyledText = styled.p<{ theme: any; $props: TypographyProps }>`
  margin: 0;
  box-sizing: border-box;
  ${(props) => typographyPropsToStyles(props.$props, props.theme)}
`;

/**
 * Text Component
 * 
 * A comprehensive text component that provides consistent typography
 * across the application with full theme integration.
 * 
 * @param props - Typography props for text styling
 * @returns JSX Element
 */
class Text extends PureComponent<ITextProps> {
    override render(): ReactNode {
        const { children, theme, className, testId, ...typographyProps } = this.props;

        return (
            <StyledText
                theme={theme}
                $props={typographyProps}
                className={className}
                data-testid={testId}
            >
                {children}
            </StyledText>
        );
    }
}

Text.displayName = 'Text';

export default Text;
