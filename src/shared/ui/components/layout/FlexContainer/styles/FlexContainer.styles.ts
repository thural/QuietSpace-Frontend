/**
 * FlexContainer Component Styles
 * 
 * Enterprise-grade flexbox container styles using Emotion CSS with
 * theme integration. Includes direction, alignment, spacing, and responsive design.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { css } from '@emotion/react';
import { 
  getSpacing, 
  getColor, 
  getRadius, 
  getBorderWidth, 
  getShadow, 
  getTransition,
  getBreakpoint
} from '../../../utils';

/**
 * FlexContainer base styles
 */
export const flexContainerBaseStyles = (theme?: any) => css`
  box-sizing: border-box;
  display: flex;
  font-family: ${theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
`;

/**
 * FlexContainer direction styles
 */
export const flexDirectionStyles = (direction?: string) => {
  const directions = {
    row: css`flex-direction: row;`,
    'row-reverse': css`flex-direction: row-reverse;`,
    column: css`flex-direction: column;`,
    'column-reverse': css`flex-direction: column-reverse;`,
  };

  return directions[direction as keyof typeof directions] || directions.row;
};

/**
 * FlexContainer wrap styles
 */
export const flexWrapStyles = (wrap?: string) => {
  const wraps = {
    nowrap: css`flex-wrap: nowrap;`,
    wrap: css`flex-wrap: wrap;`,
    'wrap-reverse': css`flex-wrap: wrap-reverse;`,
  };

  return wraps[wrap as keyof typeof wraps] || wraps.nowrap;
};

/**
 * FlexContainer justify styles
 */
export const flexJustifyStyles = (justify?: string) => {
  const justifies = {
    'flex-start': css`justify-content: flex-start;`,
    'flex-end': css`justify-content: flex-end;`,
    center: css`justify-content: center;`,
    'space-between': css`justify-content: space-between;`,
    'space-around': css`justify-content: space-around;`,
    'space-evenly': css`justify-content: space-evenly;`,
  };

  return justifies[justify as keyof typeof justifies] || justifies['flex-start'];
};

/**
 * FlexContainer align styles
 */
export const flexAlignStyles = (align?: string) => {
  const aligns = {
    'flex-start': css`align-items: flex-start;`,
    'flex-end': css`align-items: flex-end;`,
    center: css`align-items: center;`,
    stretch: css`align-items: stretch;`,
    baseline: css`align-items: baseline;`,
  };

  return aligns[align as keyof typeof aligns] || aligns.stretch;
};

/**
 * FlexContainer gap styles
 */
export const flexGapStyles = (theme?: any, gap?: string | number) => {
  if (!gap) return '';

  if (typeof gap === 'string') {
    return css`gap: ${gap};`;
  }

  return css`gap: ${getSpacing(theme, gap.toString())};`;
};

/**
 * FlexContainer spacing styles
 */
export const flexSpacingStyles = (theme?: any, spacing?: string | number) => {
  if (!spacing) return '';

  if (typeof spacing === 'string') {
    return css`padding: ${spacing};`;
  }

  return css`padding: ${getSpacing(theme, spacing.toString())};`;
};

/**
 * FlexContainer margin styles
 */
export const flexMarginStyles = (theme?: any, margin?: string | number) => {
  if (!margin) return '';

  if (typeof margin === 'string') {
    return css`margin: ${margin};`;
  }

  return css`margin: ${getSpacing(theme, margin.toString())};`;
};

/**
 * FlexContainer responsive styles
 */
export const flexResponsiveStyles = (theme?: any, direction?: string) => {
  return css`
    @media (max-width: ${getBreakpoint(theme, 'sm')}) {
      flex-direction: ${(direction === 'row' || direction === 'row-reverse') ? 'column' : direction || 'column'};
      gap: ${getSpacing(theme, 'sm')};
    }
  `;
};

/**
 * FlexContainer dimension styles
 */
export const flexDimensionStyles = (minHeight?: string | number, maxHeight?: string | number) => {
  const styles = [];

  if (minHeight) {
    styles.push(css`min-height: ${typeof minHeight === 'number' ? `${minHeight}px` : minHeight};`);
  }

  if (maxHeight) {
    styles.push(css`max-height: ${typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight};`);
  }

  return css`${styles.join(' ')}`;
};

/**
 * FlexContainer flex item styles
 */
export const flexItemStyles = (flexGrow?: number, flexShrink?: number, flexBasis?: string | number, alignSelf?: string) => {
  const styles = [];

  if (flexGrow !== undefined) {
    styles.push(css`flex-grow: ${flexGrow};`);
  }

  if (flexShrink !== undefined) {
    styles.push(css`flex-shrink: ${flexShrink};`);
  }

  if (flexBasis !== undefined) {
    styles.push(css`flex-basis: ${typeof flexBasis === 'number' ? `${flexBasis}px` : flexBasis};`);
  }

  if (alignSelf) {
    const alignMap = {
      auto: css`align-self: auto;`,
      'flex-start': css`align-self: flex-start;`,
      'flex-end': css`align-self: flex-end;`,
      center: css`align-self: center;`,
      baseline: css`align-self: baseline;`,
      stretch: css`align-self: stretch;`,
    };
    styles.push(alignMap[alignSelf as keyof typeof alignMap]);
  }

  if (order !== undefined) {
    styles.push(css`order: ${order};`);
  }

  return css`${styles.join(' ')}`;
};

/**
 * FlexContainer inline styles
 */
export const flexInlineStyles = (inline?: boolean) => {
  return inline ? css`display: inline-flex;` : css`display: flex;`;
};
