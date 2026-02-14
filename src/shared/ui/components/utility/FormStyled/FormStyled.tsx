/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { formContainerStyles } from './styles';
import { IFormStyledProps } from './interfaces';
import withForwardedRefAndErrBoundary from '@/shared/hooks/withForwardedRef';

/**
 * Enterprise FormStyled Component
 * 
 * A styled form container component with enterprise-grade styling,
 * theme integration, and responsive design. Built with Emotion CSS
 * for optimal performance and consistency.
 * 
 * @example
 * ```tsx
 * <FormStyled>
 *   <form>
 *     {/* Form content */}
 *   </form>
 * </FormStyled>
 * ```
 */
class FormStyled extends PureComponent<IFormStyledProps> {
  /**
   * Renders the form container with enterprise styling
   * 
   * @returns JSX element representing the form container
   */
  override render(): ReactNode {
    const { forwardedRef, children, className } = this.props;

    return (
      <form 
        css={formContainerStyles(undefined)} 
        ref={forwardedRef} 
        className={className}
      >
        {children}
      </form>
    );
  }
}

export default withForwardedRefAndErrBoundary(FormStyled);
