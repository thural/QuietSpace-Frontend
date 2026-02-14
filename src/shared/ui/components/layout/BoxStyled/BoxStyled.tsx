/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { boxContainerStyles } from './styles';
import { IBoxStyledProps } from './interfaces';
import Container from '../Container';

/**
 * Enterprise BoxStyled Component
 * 
 * A versatile box container component with enterprise-grade styling,
 * theme integration, and responsive design. Built with Emotion CSS
 * for optimal performance and consistency.
 * 
 * @example
 * ```tsx
 * <BoxStyled className="custom-box">
 *   <Content />
 * </BoxStyled>
 * ```
 */
class BoxStyled extends PureComponent<IBoxStyledProps> {
  /**
   * Renders the box container with enterprise styling
   * 
   * @returns JSX element representing the box container
   */
  override render(): ReactNode {
    const { forwardedRef, children, className, ...props } = this.props;

    return (
      <div 
        css={boxContainerStyles(undefined)}
        ref={forwardedRef}
        className={className}
        {...props}
      >
        {children}
      </div>
    );
  }
}

export default BoxStyled;
