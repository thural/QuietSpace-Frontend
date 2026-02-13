import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import styled from 'styled-components';
import { PureComponent, ReactNode } from 'react';
import { getSpacing, getColor, getRadius, getShadow, getTransition, getBorderWidth } from '../utils';
import { EnhancedTheme } from '@/core/modules/theming';

interface IFormStyledProps extends Omit<GenericWrapperWithRef, 'style'> {
  children?: ReactNode;
}

// Enterprise styled-components for form styling
const FormContainer = styled.form<{ theme: EnhancedTheme }>`
  display: flex;
  flex-direction: column;
  gap: ${props => getSpacing(props.theme, 'md')};
  padding: ${props => getSpacing(props.theme, 'lg')};
  background: ${props => getColor(props.theme, 'background.primary')};
  border: ${props => getBorderWidth(props.theme, 'sm')} solid ${props => getColor(props.theme, 'border.medium')};
  border-radius: ${props => getRadius(props.theme, 'md')};
  box-shadow: ${props => getShadow(props.theme, 'sm')};
  transition: ${props => getTransition(props.theme, 'all', 'normal', 'ease')};
  
  &:hover {
    border-color: ${props => getColor(props.theme, 'border.dark')};
  }
  
  &:focus-within {
    border-color: ${props => getColor(props.theme, 'brand.500')};
    box-shadow: 0 0 0 3px ${props => getColor(props.theme, 'brand.200')};
  }
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => getSpacing(props.theme, 'md')};
    gap: ${props => getSpacing(props.theme, 'sm')};
  }
`;

class FormStyled extends PureComponent<IFormStyledProps> {
  override render(): ReactNode {
    const { forwardedRef, children, className } = this.props;

    return (
      <FormContainer ref={forwardedRef} className={className}>
        {children}
      </FormContainer>
    );
  }
}

export default withForwardedRefAndErrBoundary(FormStyled);