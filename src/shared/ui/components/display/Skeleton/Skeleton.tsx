/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { ISkeletonProps } from './interfaces';
import { createSkeletonContainerStyles } from './styles';

/**
 * Skeleton Component
 * 
 * A skeleton loading component with multiple variants and animations.
 * Provides placeholder content during loading states.
 */
class Skeleton extends PureComponent<ISkeletonProps> {
    static defaultProps: Partial<ISkeletonProps> = {
        variant: 'rectangular',
        visible: true
    };

    override render(): ReactNode {
        const {
            width,
            height,
            radius,
            variant,
            size,
            visible,
            className,
            testId,
            theme,
            ...props
        } = this.props;

        if (!visible) return null;

        const containerStyles = createSkeletonContainerStyles(
            theme,
            width,
            height,
            variant,
            size,
            radius
        );

        return (
            <div
                css={containerStyles}
                className={className}
                data-testid={testId}
                {...props}
            />
        );
    }
}

export default Skeleton;
