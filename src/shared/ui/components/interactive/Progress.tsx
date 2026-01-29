import React from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';

interface ProgressProps extends BaseComponentProps {
    value?: number;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    striped?: boolean;
    animated?: boolean;
}

const ProgressContainer = styled.div<{ $size: string }>`
  width: 100%;
  height: ${props => props.$size === 'sm' ? '0.25rem' : props.$size === 'lg' ? '0.75rem' : '0.5rem'};
  background-color: ${props => props.theme.colors?.border || '#e1e4e8'};
  border-radius: ${props => props.$size === 'sm' ? '0.125rem' : props.$size === 'lg' ? '0.375rem' : '0.25rem'};
  overflow: hidden;
`;

const ProgressBar = styled.div<{ $value: number; $size: string; $color: string; $striped: boolean; $animated: boolean }>`
  height: 100%;
  width: ${props => Math.min(Math.max(props.$value, 0), 100)}%;
  background-color: ${props => props.$color || props.theme.colors?.primary || '#007bff'};
  border-radius: inherit;
  transition: width 0.3s ease;
  
  ${props => props.$striped && `
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent
    );
    background-size: 1rem 1rem;
  `}
  
  ${props => props.$animated && props.$striped && `
    animation: progress-bar-stripes 1s linear infinite;
  `}
  
  @keyframes progress-bar-stripes {
    0% {
      background-position: 1rem 0;
    }
    100% {
      background-position: 0 0;
    }
  }
`;

export const Progress: React.FC<ProgressProps> = ({
    value = 0,
    max = 100,
    size = 'md',
    color,
    striped = false,
    animated = false,
    className,
    style,
    testId,
}) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;

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
};
