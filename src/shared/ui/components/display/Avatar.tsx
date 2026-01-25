/**
 * Enterprise Avatar Component
 * 
 * A versatile avatar component that replaces the original Avatar component
 * with enhanced theme integration and enterprise patterns.
 */

import React from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';

// Styled components
const AvatarContainer = styled.div<{ theme: any; size?: string; radius?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border-radius: ${props => props.radius || '50%'};
  background-color: ${props => props.theme.colors?.primary || '#007bff'};
  color: white;
  font-weight: 500;
  font-size: ${props => `calc(${props.size || '40px'} * 0.4)`};
  overflow: hidden;
  position: relative;
`;

const AvatarImage = styled.img<{ theme: any; radius?: string }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${props => props.radius || '50%'};
`;

const AvatarPlaceholder = styled.div<{ theme: any; color?: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.color || props.theme.colors?.primary || '#007bff'};
  color: white;
  font-weight: 500;
  text-transform: uppercase;
`;

// Props interfaces
export interface AvatarProps extends BaseComponentProps {
    src?: string;
    alt?: string;
    size?: string | number;
    radius?: string;
    color?: string;
    children?: React.ReactNode;
}

// Main Avatar component
export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt = '',
    size = 'md',
    radius = '50%',
    color,
    children,
    className,
    testId,
    ...props
}) => {
    // Convert numeric size to string
    const sizeValue = typeof size === 'number' ? `${size}px` : size;

    // Convert size variants to actual pixel values
    const getSizePixels = (size: string | number) => {
        const sizeMap: Record<string, string> = {
            xs: '24px',
            sm: '32px',
            md: '40px',
            lg: '48px',
            xl: '64px'
        };

        if (typeof size === 'number') return `${size}px`;
        return sizeMap[size] || size;
    };

    const finalSize = getSizePixels(size);
    const finalRadius = radius === '50%' ? '50%' : radius;

    return (
        <AvatarContainer
            className={className}
            data-testid={testId}
            size={finalSize}
            radius={finalRadius}
            {...props}
        >
            {src ? (
                <AvatarImage
                    src={src}
                    alt={alt}
                    radius={finalRadius}
                />
            ) : (
                <AvatarPlaceholder color={color}>
                    {children}
                </AvatarPlaceholder>
            )}
        </AvatarContainer>
    );
};

Avatar.displayName = 'Avatar';

export default Avatar;
