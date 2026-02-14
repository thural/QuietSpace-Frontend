/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { ILoaderProps } from './interfaces';
import { createLoaderContainerStyles, createSpinnerStyles } from './styles';

/**
 * Loader Component
 * 
 * A loading spinner component with smooth animations.
 * Provides multiple sizes and color variants.
 */
class Loader extends PureComponent<ILoaderProps> {
    static defaultProps: Partial<ILoaderProps> = {
        size: 'md',
        variant: 'md'
    };

    override render(): ReactNode {
        const {
            size,
            color,
            borderWidth,
            className,
            testId,
            theme,
            ...props
        } = this.props;

        const containerStyles = createLoaderContainerStyles();
        const spinnerStyles = createSpinnerStyles(theme, size, color, borderWidth);

        return (
            <div
                css={containerStyles}
                className={className}
                data-testid={testId}
                {...props}
            >
                <div css={spinnerStyles} />
            </div>
        );
    }
}

export default Loader;
