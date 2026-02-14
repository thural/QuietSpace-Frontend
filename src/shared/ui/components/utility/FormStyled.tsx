/** @jsxImportSource @emotion/react */
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef";
import { PureComponent, ReactNode } from 'react';
import { css } from '@emotion/react';
import { getSpacing, getColor, getRadius, getShadow, getTransition, getBorderWidth } from '../utils';
import { EnhancedTheme } from '@/core/modules/theming';

interface IFormStyledProps extends Omit<GenericWrapperWithRef, 'style'> {
  children?: ReactNode;
}

// Enterprise Emotion CSS for form styling
const formContainerStyles = (theme?: EnhancedTheme) => css`
  display: flex;
  flex-direction: column;
  gap: ${getSpacing(theme || {} as any, 'md')};
  padding: ${getSpacing(theme || {} as any, 'lg')};
  background: ${getColor(theme || {} as any, 'background.primary')};
  border: ${getBorderWidth(theme || {} as any, 'sm')} solid ${getColor(theme || {} as any, 'border.medium')};
  border-radius: ${getRadius(theme || {} as any, 'md')};
  box-shadow: ${getShadow(theme || {} as any, 'sm')};
  transition: ${getTransition(theme || {} as any, 'all', 'normal', 'ease')};
  
  &:hover {
    border-color: ${getColor(theme || {} as any, 'border.dark')};
  }
  
  &:focus-within {
    border-color: ${getColor(theme || {} as any, 'brand.500')};
    box-shadow: 0 0 0 3px ${getColor(theme || {} as any, 'brand.200')};
  }
  
  // Responsive design
  @media (max-width: ${theme?.breakpoints?.sm || '640px'}) {
    padding: ${getSpacing(theme || {} as any, 'md')};
    gap: ${getSpacing(theme || {} as any, 'sm')};
  }
`;

class FormStyled extends PureComponent<IFormStyledProps> {
  override render(): ReactNode {
    const { forwardedRef, children, className } = this.props;

    return (
      <form css={formContainerStyles(undefined)} ref={forwardedRef} className={className}>
        {children}
      </form>
    );
  }
}

export default withForwardedRefAndErrBoundary(FormStyled);