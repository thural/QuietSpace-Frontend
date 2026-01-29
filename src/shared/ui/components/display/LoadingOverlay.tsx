/**
 * Enterprise LoadingOverlay Component
 * 
 * A loading overlay component that replaces the original LoadingOverlay component
 * with enhanced theme integration and enterprise patterns.
 */

import React from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';

// Styled components
const OverlayContainer = styled.div<{ theme: any; visible?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.colors?.overlay || 'rgba(0, 0, 0, 0.5)'};
  display: ${props => props.visible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LoadingContent = styled.div<{ theme: any }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing(props.theme.spacingFactor.md)};
  padding: ${props => props.theme.spacing(props.theme.spacingFactor.lg)};
  background-color: ${props => props.theme.colors?.background || '#ffffff'};
  border-radius: ${props => props.theme.radius?.md || '8px'};
  box-shadow: ${props => props.theme.shadows?.lg || '0 4px 6px rgba(0, 0, 0, 0.1)'};
`;

const Spinner = styled.div<{ theme: any; size?: string; color?: string }>`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border: 3px solid ${props => props.theme.colors?.backgroundSecondary || '#f0f0f0'};
  border-top: 3px solid ${props => props.color || props.theme.colors?.primary || '#007bff'};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div<{ theme: any }>`
  color: ${props => props.theme.colors?.text || '#333'};
  font-size: ${props => props.theme.typography.fontSize.primary};
  font-weight: 500;
`;

// Props interfaces
export interface LoadingOverlayProps extends BaseComponentProps {
    visible?: boolean;
    loaderProps?: {
        size?: string;
        color?: string;
    };
    text?: string;
}

// Main LoadingOverlay component
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    visible = true,
    loaderProps,
    text,
    className,
    testId,
    ...props
}) => {
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
};

LoadingOverlay.displayName = 'LoadingOverlay';

export default LoadingOverlay;
