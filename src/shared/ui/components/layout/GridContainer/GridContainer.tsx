/** @jsxImportSource @emotion/react */
import React, { PureComponent, ReactNode } from 'react';
import { css } from '@emotion/react';
import { IGridContainerProps } from './interfaces';
import {
  gridContainerBaseStyles,
  gridContainerColumnsStyles,
  gridContainerGapStyles,
  gridContainerResponsiveStyles
} from './styles';

/**
 * GridContainer Component
 * 
 * A specialized container that provides CSS Grid layout with responsive design.
 * Perfect for card layouts, image galleries, and grid-based designs.
 * Built using enterprise class-based pattern with theme integration.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */
export class GridContainer extends PureComponent<IGridContainerProps> {
  static displayName = 'GridContainer';

  /**
   * Get container styles based on props and theme tokens
   */
  private getContainerStyles = (theme: any) => {
    const { columns = 1, gap } = this.props;

    return css`
      ${gridContainerBaseStyles(theme)}
      ${gridContainerColumnsStyles(columns)}
      ${gridContainerGapStyles(gap, theme)}
      ${gridContainerResponsiveStyles(theme)}
    `;
  };

  override render(): ReactNode {
    const {
      children,
      theme,
      className,
      testId,
      style,
      columns,
      gap
    } = this.props;

    const containerStyles = this.getContainerStyles(theme);

    return (
      <div
        css={containerStyles}
        className={className}
        data-testid={testId}
        style={style}
      >
        {children}
      </div>
    );
  }
}
