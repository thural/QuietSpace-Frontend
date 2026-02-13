import { PureComponent, ReactNode } from 'react';
import styled from 'styled-components';
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

const ProgressContainer = styled.div<{ $size: string; theme?: any }>`
  width: 100%;
  height: ${props => {
    switch (props.$size) {
      case 'sm': return getSpacing(props.theme, 2);
      case 'lg': return getSpacing(props.theme, 12);
      default: return getSpacing(props.theme, 8);
    }
  }};
  background-color: ${props => getColor(props.theme, 'border.light')};
  border-radius: ${props => {
    switch (props.$size) {
      case 'sm': return getRadius(props.theme, 'xs');
      case 'lg': return getRadius(props.theme, 'sm');
      default: return getRadius(props.theme, 'xs');
    }
  }};
  overflow: hidden;
`;

const ProgressBar = styled.div<{ $value: number; $size: string; $color: string; $striped: boolean; $animated: boolean; theme?: any }>`
  height: 100%;
  width: ${props => Math.min(Math.max(props.$value, 0), 100)}%;
  background-color: ${props => getColor(props.theme, props.$color || 'brand.500')};
  border-radius: inherit;
  transition: ${props => getTransition(props.theme, 'width', 'normal', 'ease')};
  
  ${props => props.$striped && `
    background-image: ${props => props.theme.colors?.gradient || 'linear-gradient(45deg, #007bff, #6f42c1)'};
    background-size: ${props => getSpacing(props.theme, 'sm')} ${props => getSpacing(props.theme, 'sm')};
  `}
  
  ${props => props.$animated && props.$striped && `
    animation: progress-bar-stripes 1s linear infinite;
  `}
  
  @keyframes progress-bar-stripes {
    0% {
      background-position: ${props => getSpacing(props.theme, 16)} 0;
    }
    100% {
      background-position: 0 0;
    }
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
      testId
    } = this.props;

    const percentage = this.calculatePercentage(value, max);

    return (
      <ProgressContainer
        $size={size}
        className={className}
        style={style}
        data-testid={testId}
      >
        <ProgressBar
          $value={percentage}
          $size={size}
          $color={color}
          $striped={striped}
          $animated={animated}
        />
      </ProgressContainer>
    );
  }
}

export default Progress;
