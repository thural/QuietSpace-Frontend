/**
 * Enterprise Avatar Component
 * 
 * A versatile avatar component that replaces the original Avatar component
 * with enhanced theme integration and enterprise patterns.
 */

import React, { PureComponent, ReactNode, RefObject } from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';
import { ComponentSize } from '../../utils/themeTokenHelpers';

// Styled components with theme token integration
interface AvatarContainerProps {
    size?: string;
    radius?: string;
    theme?: any;
}

const AvatarContainer = styled.div<AvatarContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border-radius: ${props => props.radius || '50%'};
  background-color: ${props => props.theme?.colors?.brand?.[500] || props.theme?.colors?.primary || '#007bff'};
  color: ${props => props.theme?.colors?.text?.inverse || '#ffffff'};
  font-weight: ${props => props.theme?.typography?.fontWeight?.medium || '500'};
  font-size: ${props => `calc(${props.size || '40px'} * 0.4)`};
  font-family: ${props => props.theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
  overflow: hidden;
  position: relative;
  transition: all ${props => props.theme?.animation?.duration?.fast || '0.2s'} ${props => props.theme?.animation?.easing?.ease || 'ease'};
  
  &:hover {
    transform: scale(1.05);
    box-shadow: ${props => props.theme?.shadows?.md || '0 4px 6px rgba(0, 0, 0, 0.1)'};
  }
`;

interface AvatarImageProps {
    radius?: string;
}

const AvatarImage = styled.img<AvatarImageProps>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${props => props.radius || '50%'};
  transition: all ${props => props.theme?.animation?.duration?.fast || '0.2s'} ${props => props.theme?.animation?.easing?.ease || 'ease'};
`;

interface AvatarPlaceholderProps {
    color?: string;
    theme?: any;
}

const AvatarPlaceholder = styled.div<AvatarPlaceholderProps>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.color || props.theme?.colors?.brand?.[500] || props.theme?.colors?.primary || '#007bff'};
  color: ${props => props.theme?.colors?.text?.inverse || '#ffffff'};
  font-weight: ${props => props.theme?.typography?.fontWeight?.medium || '500'};
  text-transform: uppercase;
  font-family: ${props => props.theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
`;

// Props interfaces
interface IAvatarProps extends Omit<BaseComponentProps, 'ref' | 'id'> {
    src?: string;
    alt?: string;
    size?: string | number | ComponentSize;
    radius?: string;
    color?: string;
    variant?: 'circle' | 'square' | 'rounded';
    children?: ReactNode;
    ref?: RefObject<HTMLDivElement>;
    id?: string;
}

// Main Avatar class component
class Avatar extends PureComponent<IAvatarProps> {
    static defaultProps: Partial<IAvatarProps> = {
        alt: '',
        size: 'md',
        variant: 'circle',
    };

    // Size mapping for consistent sizing using theme tokens
    private readonly sizeMap: Record<string, string> = {
        xs: '24px',
        sm: '32px',
        md: '40px',
        lg: '48px',
        xl: '64px'
    };

    // ComponentSize mapping
    private readonly componentSizeMap: Record<ComponentSize, string> = {
        xs: '24px',
        sm: '32px',
        md: '40px',
        lg: '48px',
        xl: '64px'
    };

    // Radius mapping for variants
    private readonly radiusMap: Record<string, string> = {
        circle: '50%',
        square: '0%',
        rounded: '8px'
    };

    // Convert numeric size to string
    private convertSizeToString = (size: string | number): string => {
        return typeof size === 'number' ? `${size}px` : size;
    };

    // Get size in pixels with variant support
    private getSizePixels = (size: string | number | ComponentSize | undefined): string => {
        if (typeof size === 'number') return `${size}px`;
        if (typeof size === 'string' && this.sizeMap[size]) return this.sizeMap[size];
        if (size && this.componentSizeMap[size as ComponentSize]) return this.componentSizeMap[size as ComponentSize];
        return this.sizeMap.md;
    };

    // Get final radius value based on variant
    private getFinalRadius = (variant?: string, radius?: string): string => {
        if (radius) return radius;
        return this.radiusMap[variant || 'circle'] || '50%';
    };

    // Get initials from text
    private getInitials = (text?: string): string => {
        if (!text) return '';
        const words = text.trim().split(/\s+/);
        if (words.length === 1) {
            return words[0].charAt(0).toUpperCase();
        }
        return words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('');
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
                {children || '?'}
            </AvatarPlaceholder>
        );
    };

    override render(): ReactNode {
        const {
            src,
            alt,
            size,
            variant,
            radius,
            color,
            children,
            className,
            testId,
            ...props
        } = this.props;

        const finalSize = this.getSizePixels(size);
        const finalRadius = this.getFinalRadius(variant, radius);
        const placeholderContent = children || this.getInitials(alt);

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
                    this.renderPlaceholder(color, placeholderContent)
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
