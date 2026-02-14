/** @jsxImportSource @emotion/react */
import { useTheme } from '@/core/modules/theming';
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import { IContainerProps, IContainerState } from './interfaces';
import {
  containerAlignmentStyles,
  containerAppearanceStyles,
  containerBaseStyles,
  containerDimensionStyles,
  containerMarginStyles,
  containerOverflowStyles,
  containerResponsiveStyles,
  containerSizeStyles,
  containerSpacingStyles,
  containerVariantStyles
} from './styles';

/**
 * Container Component
 * 
 * Enterprise-grade layout container that provides consistent spacing,
 * positioning, and layout utilities across application with comprehensive
 * variant support and responsive design.
 */
export class Container extends BaseClassComponent<IContainerProps, IContainerState> {
  static defaultProps: Partial<IContainerProps> = {
    variant: 'default',
  };

  protected override getInitialState(): Partial<IContainerState> {
    return {};
  }

  protected override renderContent(): React.ReactNode {
    const {
      children,
      variant,
      size,
      padding,
      margin,
      className,
      testId,
      id,
      onClick,
      style,
      ref,
      maxWidth,
      minWidth,
      fullHeight,
      verticalAlign,
      horizontalAlign,
      overflow,
      backgroundColor,
      borderRadius,
      boxShadow,
      containerClassName
    } = this.props;

    const theme = useTheme();

    return (
      <div
        ref={ref}
        css={[
          containerBaseStyles(theme),
          containerVariantStyles(theme, variant),
          containerSizeStyles(theme, size),
          containerSpacingStyles(theme, padding),
          containerMarginStyles(theme, margin),
          containerAlignmentStyles(verticalAlign, horizontalAlign),
          containerResponsiveStyles(theme, variant),
          containerDimensionStyles(fullHeight, maxWidth, minWidth),
          containerAppearanceStyles(theme, backgroundColor, borderRadius, boxShadow),
          containerOverflowStyles(overflow)
        ]}
        className={`${className || ''} ${containerClassName || ''}`}
        id={id?.toString()}
        data-testid={testId}
        onClick={onClick}
        style={style}
      >
        {children}
      </div>
    );
  }
}

export default Container;
