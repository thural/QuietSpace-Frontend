import { Container } from "@/shared/ui/components/layout/Container";
import styled from 'styled-components';
import { EnhancedTheme } from '@/core/theme';
import React, { PureComponent, ReactNode } from 'react';
import { GenericWrapper } from "@shared-types/sharedComponentTypes";

// Enterprise styled-components for default container styling
const DefaultContainerWrapper = styled.div<{ theme: EnhancedTheme }>`
  padding-top: ${props => props.theme.spacing.xl};
  
  & hr {
    border: none;
    height: 0.1px;
    background: ${props => props.theme.colors.border.medium};
    margin-top: ${props => props.theme.spacing.md};
  }
  
  &:not(:last-child) {
    border-bottom: 0.1px solid ${props => props.theme.colors.border.light};
  }
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding-top: ${props => props.theme.spacing.lg};
  }
`;

/**
 * Enterprise Default Container Component
 * 
 * Replaces JSS-based defaultContainerStyles with enterprise styled-components
 * following theme system patterns and class component best practices.
 */
class DefaultContainer extends PureComponent<GenericWrapper> {
    static defaultProps: Partial<GenericWrapper> = {
        size: "600px"
    };

    render(): ReactNode {
        const { forwardRef, size, children, className, ...props } = this.props;

        return (
            <DefaultContainerWrapper className={className}>
                <Container
                    ref={forwardRef}
                    maxWidth={size}
                    {...props}
                >
                    {children}
                </Container>
            </DefaultContainerWrapper>
        );
    }
}

export default DefaultContainer;