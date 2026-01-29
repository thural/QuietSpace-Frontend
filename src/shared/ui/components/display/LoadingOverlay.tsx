/**
 * Enterprise LoadingOverlay Component
 * 
 * A loading overlay component that replaces the original LoadingOverlay component
 * with enhanced theme integration and enterprise patterns.
 */

import React, { PureComponent, ReactNode } from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';

// Styled components
interface OverlayContainerProps {
  visible?: boolean;
}

const OverlayContainer = styled.div<OverlayContainerProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => (props.theme as any)?.colors?.overlay || 'rgba(0, 0, 0, 0.5)'};
  display: ${props => props.visible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => (props.theme as any)?.spacing?.((props.theme as any)?.spacingFactor?.md) || '1rem'};
  padding: ${(props) => (props.theme as any)?.spacing?.((props.theme as any)?.spacingFactor?.lg) || '1.5rem'};
  background-color: ${(props) => (props.theme as any)?.colors?.background || '#ffffff'};
  border-radius: ${(props) => (props.theme as any)?.radius?.md || '8px'};
  box-shadow: ${(props) => (props.theme as any)?.shadows?.lg || '0 4px 6px rgba(0, 0, 0, 0.1)'};
`;

interface SpinnerProps {
  size?: string;
  color?: string;
}

const Spinner = styled.div<SpinnerProps>`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border: 3px solid ${(props) => (props.theme as any)?.colors?.backgroundSecondary || '#f0f0f0'};
  border-top: 3px solid ${props => props.color || (props.theme as any)?.colors?.primary || '#007bff'};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  color: ${(props) => (props.theme as any)?.colors?.text || '#333'};
  font-size: ${(props) => (props.theme as any)?.typography?.fontSize?.primary || '16px'};
  font-weight: 500;
`;

// Props interfaces
interface ILoadingOverlayProps extends Omit<BaseComponentProps, 'ref' | 'id'> {
  visible?: boolean;
  loaderProps?: {
    size?: string;
    color?: string;
  };
  text?: string;
  ref?: React.RefObject<HTMLDivElement>;
  id?: string;
}

// Main LoadingOverlay component
class LoadingOverlay extends PureComponent<ILoadingOverlayProps> {
  static defaultProps: Partial<ILoadingOverlayProps> = {
    visible: true
  };

  render(): ReactNode {
    const {
      visible,
      loaderProps,
      text,
      className,
      testId,
      ...props
    } = this.props;

    return (
      <OverlayContainer
        className={className}
        data-testid={testId}
        visible={visible}
        {...props}
      >
        <LoadingContent>
          <Spinner
            size={loaderProps?.size}
            color={loaderProps?.color}
          />
          {text && <LoadingText>{text}</LoadingText>}
        </LoadingContent>
      </OverlayContainer>
    );
  }
}

// Set display name for debugging
(LoadingOverlay as any).displayName = 'LoadingOverlay';

export default LoadingOverlay;
