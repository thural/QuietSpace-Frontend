/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { useTheme } from '@/core/modules/theming';
import { IFlexContainerProps } from './interfaces';
import {
  flexContainerBaseStyles,
  flexDirectionStyles,
  flexWrapStyles,
  flexJustifyStyles,
  flexAlignStyles,
  flexGapStyles,
  flexSpacingStyles,
  flexMarginStyles,
  flexResponsiveStyles,
  flexDimensionStyles,
  flexItemStyles,
  flexInlineStyles
} from './styles';

/**
 * FlexContainer Component
 * 
 * Enterprise-grade flexbox container that provides comprehensive flexbox
 * utilities for creating flexible and responsive layouts with advanced
 * alignment and spacing controls.
 */
export class FlexContainer extends PureComponent<IFlexContainerProps> {
  static defaultProps: Partial<IFlexContainerProps> = {
    direction: 'row',
    wrap: 'nowrap',
    justify: 'flex-start',
    align: 'stretch',
  };

  override render(): ReactNode {
    const { 
      children,
      direction,
      wrap,
      justify,
      align,
      gap,
      padding,
      margin,
      className,
      testId,
      id,
      onClick,
      style,
      ref,
      inline,
      flexGrow,
      flexShrink,
      flexBasis,
      alignSelf,
      order,
      minHeight,
      maxHeight,
      containerClassName
    } = this.props;

    const theme = useTheme();

    return (
      <div
        ref={ref}
        css={[
          flexContainerBaseStyles(theme),
          flexDirectionStyles(direction),
          flexWrapStyles(wrap),
          flexJustifyStyles(justify),
          flexAlignStyles(align),
          flexGapStyles(theme, gap),
          flexSpacingStyles(theme, padding),
          flexMarginStyles(theme, margin),
          flexResponsiveStyles(theme, direction),
          flexDimensionStyles(minHeight, maxHeight),
          flexItemStyles(flexGrow, flexShrink, flexBasis, alignSelf, order),
          flexInlineStyles(inline)
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

export default FlexContainer;
