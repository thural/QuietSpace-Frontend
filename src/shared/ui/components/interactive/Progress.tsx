/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { css, keyframes } from '@emotion/react';
import { BaseComponentProps } from '../types';
import { getColor, getRadius, getSpacing, getTransition } from '../utils';

interface IProgressProps extends BaseComponentProps {
  value?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  striped?: boolean;
  animated?: boolean;
}

const progressStripes = keyframes`
  0% {
    background-position: 40px 0;
  }
  100% {
    background-position: 0 0;
  }
`;

class Progress extends PureComponent<IProgressProps> {
  /**
   * Calculate percentage value
   */
  private calculatePercentage = (value: number, max: number): number => {
    return max > 0 ? (value / max) * 100 : 0;
  };

  override render(): ReactNode {
    const {
      value = 0,
      max = 100,
      size = 'md',
      color,
      striped = false,
      animated = false,
      className,
      style,
      testId,
      theme
    } = this.props;

    const percentage = this.calculatePercentage(value, max);

    const progressContainerStyles = css`
      width: 100%;
      height: ${size === 'sm'
        ? getSpacing(theme || {} as any, 2)
        : size === 'lg'
          ? getSpacing(theme || {} as any, 12)
          : getSpacing(theme || {} as any, 8)
      };
      background-color: ${getColor(theme || {} as any, 'border.light')};
      border-radius: ${size === 'sm'
        ? getRadius(theme || {} as any, 'xs')
        : size === 'lg'
          ? getRadius(theme || {} as any, 'sm')
          : getRadius(theme || {} as any, 'xs')
      };
      overflow: hidden;
    `;

    const progressBarStyles = css`
      height: 100%;
      width: ${Math.min(Math.max(percentage, 0), 100)}%;
      background-color: ${getColor(theme || {} as any, color || 'brand.500')};
      border-radius: inherit;
      transition: ${getTransition(theme || {} as any, 'width', 'normal', 'ease')};
      
      ${striped && css`
        background-image: linear-gradient(45deg, ${getColor(theme || {} as any, 'brand.500')}, ${getColor(theme || {} as any, 'brand.600')});
        background-size: ${getSpacing(theme || {} as any, 'sm')} ${getSpacing(theme || {} as any, 'sm')};
      `}
      
      ${animated && striped && css`
        animation: ${progressStripes} 1s linear infinite;
      `}
    `;

    return (
      <div
        css={progressContainerStyles}
        className={className}
        style={style}
        data-testid={testId}
      >
        <div css={progressBarStyles} />
      </div>
    );
  }
}

export default Progress;
