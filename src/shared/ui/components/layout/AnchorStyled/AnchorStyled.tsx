/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { anchorStyles } from './styles';
import { IAnchorStyledProps } from './interfaces';

/**
 * Enterprise AnchorStyled Component
 * 
 * A versatile anchor/link component with enterprise-grade styling,
 * theme integration, and responsive design. Built with Emotion CSS
 * for optimal performance and consistency.
 * 
 * @example
 * ```tsx
 * <AnchorStyled 
 *   href="https://example.com"
 *   target="_blank"
 *   label="Visit Example"
 * >
 *   Example Link
 * </AnchorStyled>
 * ```
 */
class AnchorStyled extends PureComponent<IAnchorStyledProps> {
  /**
   * Renders the anchor element with enterprise styling
   * 
   * @returns JSX element representing the anchor
   */
  override render(): ReactNode {
    const {
      href = "",
      target = "_blank",
      label = "Link",
      forwardedRef,
      style,
      theme,
      className,
      ...props
    } = this.props;

    return (
      <a
        ref={forwardedRef}
        href={href}
        target={target}
        css={anchorStyles(theme)}
        style={style}
        className={className}
        {...props}
      >
        {label}
      </a>
    );
  }
}

export default AnchorStyled;
