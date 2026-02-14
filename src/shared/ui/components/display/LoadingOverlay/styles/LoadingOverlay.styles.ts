/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';

/**
 * Spin keyframes for spinner animation
 */
export const spinKeyframes = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

/**
 * Create overlay container styles
 */
export const createOverlayContainerStyles = (
    visible: boolean,
    blur?: number,
    overlayColor?: string
) => css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${overlayColor || 'rgba(0, 0, 0, 0.5)'};
  backdrop-filter: ${blur ? `blur(${blur}px)` : 'none'};
  display: ${visible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

/**
 * Create loading content styles
 */
export const createLoadingContentStyles = (
    radius?: string,
    backgroundColor?: string
) => css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background-color: ${backgroundColor || '#ffffff'};
  border-radius: ${radius || '0.5rem'};
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

/**
 * Create spinner styles
 */
export const createSpinnerStyles = (
    size?: string,
    color?: string
) => css`
  width: ${size || '2rem'};
  height: ${size || '2rem'};
  border: 3px solid #f3f4f6;
  border-top: 3px solid ${color || '#3b82f6'};
  border-radius: 50%;
  animation: ${spinKeyframes} 1s linear infinite;
`;

/**
 * Create message styles
 */
export const createMessageStyles = (
    size?: string
) => {
    const fontSizeMap = {
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem'
    };

    return css`
        color: #374151;
        font-size: ${fontSizeMap[size as keyof typeof fontSizeMap] || fontSizeMap.md};
        font-weight: 500;
        text-align: center;
        margin-top: 0.5rem;
    `;
};

/**
 * Create fade-in animation styles
 */
export const createFadeInStyles = () => css`
    animation: fadeIn 0.3s ease-in-out;
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
