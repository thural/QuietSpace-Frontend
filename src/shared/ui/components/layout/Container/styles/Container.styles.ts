/**
 * Container Component Styles
 * 
 * Enterprise-grade container styles using Emotion CSS with
 * theme integration. Includes variants, spacing, and responsive design.
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
 * Container base styles
 */
export const containerBaseStyles = (theme?: any) => css`
  box-sizing: border-box;
  font-family: ${theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
`;

/**
 * Container variant styles
 */
export const containerVariantStyles = (theme?: any, variant?: string) => {
  const variants = {
    centered: css`
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    `,
    fluid: css`
      width: 100%;
      max-width: none;
    `,
    constrained: css`
      width: 100%;
      max-width: ${theme?.breakpoints?.xl || getBreakpoint(theme, 'lg')};
      margin: 0 auto;
      padding-left: ${getSpacing(theme, 'lg')};
      padding-right: ${getSpacing(theme, 'lg')};
    `,
    default: css`
      position: relative;
    `,
  };

  return variants[variant as keyof typeof variants] || variants.default;
};

/**
 * Container size styles
 */
export const containerSizeStyles = (theme?: any, size?: string) => {
  if (!size) return '';

  const sizeMap = {
    xs: css`
      padding: ${getSpacing(theme, 'xs')};
    `,
    sm: css`
      padding: ${getSpacing(theme, 'sm')};
    `,
    md: css`
      padding: ${getSpacing(theme, 'md')};
    `,
    lg: css`
      padding: ${getSpacing(theme, 'lg')};
    `,
    xl: css`
      padding: ${getSpacing(theme, 'xl')};
    `,
  };

  return sizeMap[size as keyof typeof sizeMap] || '';
};

/**
 * Container spacing styles
 */
export const containerSpacingStyles = (theme?: any, spacing?: string | number) => {
  if (!spacing) return '';

  if (typeof spacing === 'string') {
    return css`padding: ${spacing};`;
  }

  return css`padding: ${getSpacing(theme, spacing.toString())};`;
};

/**
 * Container margin styles
 */
export const containerMarginStyles = (theme?: any, margin?: string | number) => {
  if (!margin) return '';

  if (typeof margin === 'string') {
    return css`margin: ${margin};`;
  }

  return css`margin: ${getSpacing(theme, margin.toString())};`;
};

/**
 * Container alignment styles
 */
export const containerAlignmentStyles = (verticalAlign?: string, horizontalAlign?: string) => {
  const styles = [];

  if (verticalAlign) {
    const alignmentMap = {
      top: css`align-items: flex-start;`,
      center: css`align-items: center;`,
      bottom: css`align-items: flex-end;`,
      stretch: css`align-items: stretch;`,
    };
    styles.push(alignmentMap[verticalAlign as keyof typeof alignmentMap]);
  }

  if (horizontalAlign) {
    const alignmentMap = {
      left: css`justify-content: flex-start;`,
      center: css`justify-content: center;`,
      right: css`justify-content: flex-end;`,
      stretch: css`justify-content: stretch;`,
    };
    styles.push(alignmentMap[horizontalAlign as keyof typeof alignmentMap]);
  }

  return css`${styles.join(' ')}`;
};

/**
 * Container responsive styles
 */
export const containerResponsiveStyles = (theme?: any, variant?: string) => {
  if (variant !== 'constrained') return '';

  return css`
    @media (max-width: ${getBreakpoint(theme, 'sm')}) {
      padding-left: ${getSpacing(theme, 'md')};
      padding-right: ${getSpacing(theme, 'md')};
    }
  `;
};

/**
 * Container dimension styles
 */
export const containerDimensionStyles = (fullHeight?: boolean, maxWidth?: string, minWidth?: string) => {
  const styles = [];

  if (fullHeight) {
    styles.push(css`height: 100vh;`);
  }

  if (maxWidth) {
    styles.push(css`max-width: ${maxWidth};`);
  }

  if (minWidth) {
    styles.push(css`min-width: ${minWidth};`);
  }

  return css`${styles.join(' ')}`;
};

/**
 * Container appearance styles
 */
export const containerAppearanceStyles = (theme?: any, backgroundColor?: string, borderRadius?: string, boxShadow?: string) => {
  const styles = [];

  if (backgroundColor) {
    styles.push(css`background-color: ${backgroundColor};`);
  } else {
    styles.push(css`background-color: ${getColor(theme, 'background.primary')};`);
  }

  if (borderRadius) {
    styles.push(css`border-radius: ${borderRadius};`);
  } else {
    styles.push(css`border-radius: ${getRadius(theme, 'md')};`);
  }

  if (boxShadow) {
    styles.push(css`box-shadow: ${boxShadow};`);
  } else {
    styles.push(css`box-shadow: ${getShadow(theme, 'sm')};`);
  }

  return css`${styles.join(' ')}`;
};

/**
 * Container overflow styles
 */
export const containerOverflowStyles = (overflow?: string) => {
  if (!overflow) return '';

  return css`overflow: ${overflow};`;
};
