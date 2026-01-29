/**
 * Enterprise Avatar Component
 * 
 * A versatile avatar component that replaces the original Avatar component
 * with enhanced theme integration and enterprise patterns.
 */

import React, { PureComponent, ReactNode, RefObject } from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';

// Styled components
interface AvatarContainerProps {
    size?: string;
    radius?: string;
}

const AvatarContainer = styled.div<AvatarContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border-radius: ${props => props.radius || '50%'};
  background-color: ${props => (props.theme as any)?.colors?.primary || '#007bff'};
  color: white;
  font-weight: 500;
  font-size: ${props => `calc(${props.size || '40px'} * 0.4)`};
  overflow: hidden;
  position: relative;
`;

interface AvatarImageProps {
    radius?: string;
}

const AvatarImage = styled.img<AvatarImageProps>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${props => props.radius || '50%'};
`;

interface AvatarPlaceholderProps {
    color?: string;
}

const AvatarPlaceholder = styled.div<AvatarPlaceholderProps>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.color || (props.theme as any)?.colors?.primary || '#007bff'};
  color: white;
  font-weight: 500;
  text-transform: uppercase;
`;

// Props interfaces
interface IAvatarProps extends Omit<BaseComponentProps, 'ref' | 'id'> {
    src?: string;
    alt?: string;
    size?: string | number;
    radius?: string;
    color?: string;
    children?: ReactNode;
    ref?: RefObject<HTMLDivElement>;
    id?: string;
}

// Main Avatar class component
class Avatar extends PureComponent<IAvatarProps> {
    static defaultProps: Partial<IAvatarProps> = {
        alt: '',
        size: 'md',
        radius: '50%',
    };

    // Size mapping for consistent sizing
    private readonly sizeMap: Record<string, string> = {
        xs: '24px',
        sm: '32px',
        md: '40px',
        lg: '48px',
        xl: '64px'
    };

    // Convert numeric size to string
    private convertSizeToString = (size: string | number): string => {
        return typeof size === 'number' ? `${size}px` : size;
    };

    // Get size in pixels with variant support
    private getSizePixels = (size: string | number): string => {
        if (typeof size === 'number') return `${size}px`;
        return this.sizeMap[size] || size;
    };

    // Get final radius value
    private getFinalRadius = (radius?: string): string => {
        return radius === '50%' ? '50%' : (radius || '50%');
    };

    // Render image component
    private renderImage = (src: string, alt: string, radius: string): ReactNode => {
        return (
            <AvatarImage
                src={src}
                alt={alt}
                radius={radius}
            />
        );
    };

    // Render placeholder component
    private renderPlaceholder = (color?: string, children?: ReactNode): ReactNode => {
        return (
            <AvatarPlaceholder color={color}>
                {children}
            </AvatarPlaceholder>
        );
    };

    render(): ReactNode {
        const {
            src,
            alt,
            size,
            radius,
            color,
            children,
            className,
            testId,
            ...props
        } = this.props;

        const finalSize = this.getSizePixels(size || 'md');
        const finalRadius = this.getFinalRadius(radius);

        return (
            <AvatarContainer
                className={className}
                data-testid={testId}
                size={finalSize}
                radius={finalRadius}
                {...props}
            >
                {src ?
                    this.renderImage(src, alt || '', finalRadius) :
                    this.renderPlaceholder(color, children)
                }
            </AvatarContainer>
        );
    }
}

// Set display name for debugging
(Avatar as any).displayName = 'Avatar';

export { Avatar };
export type { IAvatarProps };
export default Avatar;
