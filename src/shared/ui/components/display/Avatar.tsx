/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode, RefObject } from 'react';
import { css } from '@emotion/react';
import { BaseComponentProps } from '../types';
import { ComponentSize } from '../../utils/themeTokenHelpers';
import { getComponentSize, getRadius, getColor, getSpacing, getTransition, getShadow } from '../utils';

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
    theme?: any; // Add theme prop for theme token access
}

// Main Avatar class component
class Avatar extends PureComponent<IAvatarProps> {
    static defaultProps: Partial<IAvatarProps> = {
        alt: '',
        size: 'md',
        variant: 'circle',
    };

    // Size mapping using theme tokens
    private readonly sizeMap: Record<string, string> = {
        xs: '24px',
        sm: '32px',
        md: '40px',
        lg: '48px',
        xl: '64px'
    };

    // ComponentSize mapping using theme tokens
    private readonly componentSizeMap: Record<ComponentSize, string> = {
        xs: '24px',
        sm: '32px',
        md: '40px',
        lg: '48px',
        xl: '64px'
    };

    // Radius mapping using theme tokens
    private readonly radiusMap: Record<string, string> = {
        circle: 'round',
        square: 'none',
        rounded: 'md'
    };

    // Get size using theme tokens with variant support
    private getSize = (theme: any, size: string | number | ComponentSize | undefined): string => {
        if (typeof size === 'number') return getSpacing(theme, size);
        if (typeof size === 'string' && this.sizeMap[size]) return getSpacing(theme, this.sizeMap[size]);
        if (size && this.componentSizeMap[size as ComponentSize]) return getSpacing(theme, this.componentSizeMap[size as ComponentSize]);
        // Use theme component size if available
        try {
            return getComponentSize(theme, 'avatar', 'md');
        } catch {
            return getSpacing(theme, this.sizeMap.md);
        }
    };

    // Get final radius value using theme tokens
    private getFinalRadius = (theme: any, variant?: string, radius?: string): string => {
        if (radius) return getRadius(theme, radius);
        const radiusVariant = this.radiusMap[variant || 'circle'] || 'round';
        return getRadius(theme, radiusVariant);
    };

    // Get initials from text
    private getInitials = (text?: string): string => {
        if (!text) return '';
        const words = text.trim().split(/\s+/);
        if (words.length === 1) {
            return words[0]?.charAt(0).toUpperCase() || '';
        }
        return words.slice(0, 2).map(word => word?.charAt(0).toUpperCase() || '').join('');
    };

    // Render image component
    private renderImage = (src: string, alt: string, radius: string, theme: any): ReactNode => {
        const imageStyles = css`
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: ${radius};
            transition: ${getTransition(theme, 'all', 'fast', 'ease')};
        `;

        return (
            <img
                css={imageStyles}
                src={src}
                alt={alt}
            />
        );
    };

    // Render placeholder component
    private renderPlaceholder = (theme: any, color?: string, children?: ReactNode): ReactNode => {
        const placeholderColor = color || getColor(theme, 'brand.500');
        const placeholderStyles = css`
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: ${placeholderColor};
            color: ${getColor(theme, 'text.inverse')};
            font-weight: ${theme?.typography?.fontWeight?.medium || '500'};
            text-transform: uppercase;
            font-family: ${theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
        `;

        return (
            <div css={placeholderStyles}>
                {children || '?'}
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

        const finalSize = this.getSize(theme, size);
        const finalRadius = this.getFinalRadius(theme, variant, radius);
        const placeholderContent = children || this.getInitials(alt);

        const avatarContainerStyles = css`
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${finalSize};
            height: ${finalSize};
            border-radius: ${finalRadius};
            background-color: ${color ? getColor(theme, color) : getColor(theme, 'brand.500')};
            color: ${getColor(theme, 'text.inverse')};
            font-weight: ${theme?.typography?.fontWeight?.medium || '500'};
            font-size: calc(${finalSize} * 0.4);
            font-family: ${theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
            overflow: hidden;
            position: relative;
            transition: ${getTransition(theme, 'transform', 'fast', 'ease')};
            
            &:hover {
                transform: scale(1.05);
                box-shadow: ${getShadow(theme, 'md')};
            }
        `;

        return (
            <div
                css={avatarContainerStyles}
                className={className}
                data-testid={testId}
                {...props}
            >
                {src ?
                    this.renderImage(src, alt || '', finalRadius, theme) :
                    this.renderPlaceholder(theme, color, placeholderContent)
                }
            </div>
        );
    }
}

// Set display name for debugging
(Avatar as any).displayName = 'Avatar';

export { Avatar };
export type { IAvatarProps };
export default Avatar;
