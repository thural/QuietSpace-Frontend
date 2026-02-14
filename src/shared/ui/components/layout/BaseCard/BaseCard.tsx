/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { baseCardContainerStyles } from './styles';
import { IBaseCardProps } from './interfaces';
import FlexStyled from '../FlexStyled';

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
class BaseCard extends PureComponent<IBaseCardProps> {
  /**
   * Renders the card container with enterprise styling
   * 
   * @returns JSX element representing the card container
   */
  override render(): ReactNode {
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
