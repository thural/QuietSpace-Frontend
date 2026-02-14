/** @jsxImportSource @emotion/react */
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import { baseCardContainerStyles } from './styles';
import { IBaseCardProps, IBaseCardState } from './interfaces';
import { FlexStyled } from '../FlexStyled';

/**
 * Enterprise BaseCard Component
 * 
 * A versatile card container component with enterprise-grade styling,
 * theme integration, and responsive design. Built with Emotion CSS
 * for optimal performance and consistency.
 * 
 * @example
 * ```tsx
 * <BaseCard className="custom-card">
 *   <CardHeader />
 *   <CardContent />
 * </BaseCard>
 * ```
 */
export class BaseCard extends BaseClassComponent<IBaseCardProps, IBaseCardState> {
  protected override getInitialState(): Partial<IBaseCardState> {
    return {};
  }

  protected override renderContent(): React.ReactNode {
    const { children, theme, className, ...props } = this.props;

    return (
      <div
        css={baseCardContainerStyles(theme)}
        className={className}
        {...props}
      >
        <FlexStyled theme={theme}>{children}</FlexStyled>
      </div>
    );
  }
}

export default BaseCard;
