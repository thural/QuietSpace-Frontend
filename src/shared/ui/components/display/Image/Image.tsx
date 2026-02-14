/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { IImageProps } from './interfaces';
import { createImageStyles } from './styles';

/**
 * Image Component
 * 
 * A responsive image component with lazy loading support.
 * Provides multiple object-fit options and theme integration.
 */
class Image extends PureComponent<IImageProps> {
    static defaultProps: Partial<IImageProps> = {
        objectFit: 'cover'
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
            theme,
            ...props
        } = this.props;

        const imageStyles = createImageStyles(radius);

        return (
            <img
                css={imageStyles}
                src={src}
                alt={alt}
                width={width}
                height={height}
                style={{
                    objectFit: fit,
                    ...props.style
                }}
                className={className}
                data-testid={testId}
                {...props}
            />
        );
    }
}

export default Image;
