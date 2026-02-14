/** @jsxImportSource @emotion/react */
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import { anchorStyles } from './styles';
import { IAnchorStyledProps, IAnchorStyledState } from './interfaces';

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
export class AnchorStyled extends BaseClassComponent<IAnchorStyledProps, IAnchorStyledState> {
  protected override getInitialState(): Partial<IAnchorStyledState> {
    return {};
  }

  protected override renderContent(): React.ReactNode {
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
