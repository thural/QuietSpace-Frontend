/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { IProgressProps } from './interfaces';
import { progressStripes, createProgressContainerStyles, createProgressBarStyles } from './styles';

/**
 * Progress Component
 * 
 * A progress bar component with animations and variants.
 * Supports striped patterns and customizable colors.
 */
class Progress extends PureComponent<IProgressProps> {
    static defaultProps: Partial<IProgressProps> = {
        value: 0,
        max: 100,
        size: 'md',
        striped: false,
        animated: false
    };

    override render(): ReactNode {
        const {
            value = 0,
            max = 100,
            size = 'md',
            color,
            striped = false,
            animated = false,
            theme,
            className,
            testId
        } = this.props;

        const containerStyles = createProgressContainerStyles(theme, size);
        const barStyles = createProgressBarStyles(theme, value, max, color, striped, animated);

        return (
            <div
                css={containerStyles}
                className={className}
                data-testid={testId}
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={max}
            >
                <div css={barStyles} />
            </div>
        );
    }
}

export default Progress;
