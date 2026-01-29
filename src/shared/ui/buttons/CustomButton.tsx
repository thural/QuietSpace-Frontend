import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import React, { PureComponent, ReactNode } from 'react';
import styled from 'styled-components';
import { EnhancedTheme } from '@/core/theme';

interface ICustomButtonProps extends GenericWrapperWithRef {
    label?: ReactNode;
}

// Enterprise styled-components for custom button styling
const CustomButtonContainer = styled.button<{ theme: EnhancedTheme }>`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-family: ${props => props.theme.typography.fontFamily.sans.join(', ')};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.inverse};
  background: ${props => props.theme.colors.brand[500]};
  border: none;
  border-radius: ${props => props.theme.radius.md};
  cursor: pointer;
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    background: ${props => props.theme.colors.brand[600]};
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.md};
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: ${props => props.theme.shadows.sm};
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.brand[300]};
    outline-offset: 2px;
  }
  
  &:disabled {
    background: ${props => props.theme.colors.border.medium};
    color: ${props => props.theme.colors.text.tertiary};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    font-size: ${props => props.theme.typography.fontSize.sm};
  }
`;

class CustomButton extends PureComponent<ICustomButtonProps> {
    render(): ReactNode {
        const { forwardedRef, label, ...props } = this.props;

        return (
            <CustomButtonContainer ref={forwardedRef}>
                {label}
            </CustomButtonContainer>
        );
    }
}

export default withForwardedRefAndErrBoundary(CustomButton);