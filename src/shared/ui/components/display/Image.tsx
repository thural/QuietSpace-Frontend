/**
 * Enterprise Image Component
 * 
 * A versatile image component that replaces the original Image component
 * with enhanced theme integration and enterprise patterns.
 */

import React from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';

// Styled components
const ImageContainer = styled.img<{ theme: any; radius?: string }>`
  max-width: 100%;
  height: auto;
  border-radius: ${props => props.radius || '0'};
  object-fit: cover;
  display: block;
`;

// Props interfaces
export interface ImageProps extends BaseComponentProps {
    src?: string;
    alt?: string;
    width?: string | number;
    height?: string | number;
    radius?: string;
    fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

// Main Image component
export const Image: React.FC<ImageProps> = ({
    src,
    alt = '',
    width,
    height,
    radius = '0',
    fit = 'cover',
    className,
    testId,
    style,
    ...props
}) => {
    return (
        <ImageContainer
            src={src}
            alt={alt}
            width={width}
            height={height}
            radius={radius}
            style={{
                objectFit: fit,
                ...style
            }}
            className={className}
            data-testid={testId}
            {...props}
        />
    );
};

Image.displayName = 'Image';

export default Image;
