/** @jsxImportSource @emotion/react */
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import { FlexContainer } from "@/shared/ui/components";
import { flexContainerStyles } from './styles';
import { IFlexStyledProps, IFlexStyledState } from './interfaces';

/**
 * Enterprise FlexStyled Component
 * 
 * A versatile flex container component with enterprise-grade styling,
 * theme integration, and responsive design. Built with Emotion CSS
 * for optimal performance and consistency.
 * 
 * @example
 * ```tsx
 * <FlexStyled className="custom-flex">
 *   <Content />
 * </FlexStyled>
 * ```
 */
export class FlexStyled extends BaseClassComponent<IFlexStyledProps, IFlexStyledState> {
  protected override getInitialState(): Partial<IFlexStyledState> {
    return {};
  }

  protected override renderContent(): React.ReactNode {
    const { forwardedRef, children, className, ...props } = this.props;

    return (
      <FlexContainer 
        ref={forwardedRef}
        className={className}
        css={flexContainerStyles}
        {...props}
      >
        {children}
      </FlexContainer>
    );
  }
}
