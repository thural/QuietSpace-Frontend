/**
 * Enterprise Image Component
 * 
 * A versatile image component that replaces the original Image component
 * with enhanced theme integration and enterprise patterns.
 */

/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode, RefObject } from 'react';
import { css } from '@emotion/react';
import { BaseComponentProps } from '../types';

// Emotion CSS utility function
const createImageStyles = (radius?: string) => css`
  max-width: 100%;
  height: auto;
  border-radius: ${radius || '0'};
  object-fit: cover;
  display: block;
`;

// Props interfaces
interface IImageProps extends Omit<BaseComponentProps, 'ref' | 'id'> {
    src?: string;
    alt?: string;
    width?: string | number;
    height?: string | number;
    radius?: string;
    fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    ref?: RefObject<HTMLImageElement>;
    id?: string;
}

// Main Image component
class Image extends PureComponent<IImageProps> {
    static defaultProps: Partial<IImageProps> = {
        alt: '',
        radius: '0',
        fit: 'cover'
    };

    override render(): ReactNode {
        const {
            src,
            alt,
            width,
            height,
            radius,
            fit,
            className,
            testId,
            style,
            ...props
        } = this.props;

        return (
            <img
                css={createImageStyles(radius)}
                src={src}
                alt={alt}
                width={width}
                height={height}
                style={{
                    objectFit: fit,
                    ...style
                }}
                className={className}
                data-testid={testId}
                {...props}
            />
        );
    }
}

// Set display name for debugging
(Image as any).displayName = 'Image';

export default Image;
