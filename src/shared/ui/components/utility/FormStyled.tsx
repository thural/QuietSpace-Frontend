import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import styled from 'styled-components';
import { EnhancedTheme } from '@/core/theme';
import React, { PureComponent, ReactNode } from 'react';

interface IFormStyledProps extends GenericWrapperWithRef {
  children?: ReactNode;
}

// Enterprise styled-components for form styling
const FormContainer = styled.form<{ theme: EnhancedTheme }>`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.radius.md};
  box-shadow: ${props => props.theme.shadows.sm};
  transition: all ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    border-color: ${props => props.theme.colors.border.dark};
  }
  
  &:focus-within {
    border-color: ${props => props.theme.colors.brand[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.brand[200]};
  }
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing.md};
    gap: ${props => props.theme.spacing.sm};
  }
`;

class FormStyled extends PureComponent<IFormStyledProps> {
  override render(): ReactNode {
    const { forwardedRef, children, ...props } = this.props;

    return (
      <FormContainer ref={forwardedRef} {...props}>
        {children}
      </FormContainer>
    );
  }
}

export default withForwardedRefAndErrBoundary(FormStyled);