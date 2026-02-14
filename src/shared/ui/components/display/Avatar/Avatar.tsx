/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { IAvatarProps } from './interfaces';
import { 
    createAvatarContainerStyles, 
    createAvatarImageStyles, 
    createAvatarPlaceholderStyles,
    getAvatarSize,
    getAvatarRadius
} from './styles';

/**
 * Avatar Component
 * 
 * A versatile avatar component with support for images, placeholders, and various shapes.
 * Provides theme integration and responsive sizing.
 */
class Avatar extends PureComponent<IAvatarProps> {
    static defaultProps: Partial<IAvatarProps> = {
        alt: '',
        size: 'md',
        variant: 'circle',
    };

    /**
     * Get initials from text
     */
    private getInitials = (text?: string): string => {
        if (!text) return '';
        const words = text.trim().split(/\s+/);
        if (words.length === 1) {
            return words[0]?.charAt(0).toUpperCase() || '';
        }
        return words.slice(0, 2).map(word => word?.charAt(0).toUpperCase() || '').join('');
    };

    /**
     * Render image component
     */
    private renderImage = (src: string, alt: string, radius: string, theme: any): ReactNode => {
        const imageStyles = createAvatarImageStyles(radius, theme);

        return (
            <img
                css={imageStyles}
                src={src}
                alt={alt}
            />
        );
    };

    /**
     * Render placeholder component
     */
    private renderPlaceholder = (theme: any, color?: string, children?: ReactNode): ReactNode => {
        const placeholderStyles = createAvatarPlaceholderStyles(theme, color);

        return (
            <div css={placeholderStyles}>
                {children || this.getInitials(children?.toString())}
            </div>
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
            theme,
            ...props
        } = this.props;

        const finalSize = getAvatarSize(theme, size);
        const finalRadius = getAvatarRadius(theme, variant, radius);
        const containerStyles = createAvatarContainerStyles(theme, size, variant, radius, color);

        return (
            <div
                css={containerStyles}
                className={className}
                data-testid={testId}
                {...props}
            >
                {src ?
                    this.renderImage(src, alt || '', finalRadius, theme) :
                    this.renderPlaceholder(theme, color, children)
                }
            </div>
        );
    }
}

export default Avatar;
