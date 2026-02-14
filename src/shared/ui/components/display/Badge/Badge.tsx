/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { IBadgeProps } from './interfaces';
import { createBadgeStyles } from './styles';

/**
 * Badge Component
 * 
 * A versatile badge component with support for different variants, sizes, and colors.
 * Provides theme integration and hover effects.
 */
class Badge extends PureComponent<IBadgeProps> {
    static defaultProps: Partial<IBadgeProps> = {
        variant: 'filled',
        size: 'md'
    };

    override render(): ReactNode {
        const {
            children,
            variant,
            color,
            size,
            leftSection,
            rightSection,
            className,
            style,
            testId,
            theme
        } = this.props;

        const badgeStyles = createBadgeStyles(
            theme,
            variant || 'filled',
            color || 'brand.500',
            size || 'md',
            leftSection,
            rightSection
        );

        return (
            <span
                css={badgeStyles}
                className={className}
                style={style}
                data-testid={testId}
            >
                {leftSection}
                {children}
                {rightSection}
            </span>
        );
    }
}

export default Badge;
