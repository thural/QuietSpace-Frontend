/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode, ChangeEvent } from 'react';
import { css } from '@emotion/react';
import { BaseComponentProps } from '../types';
import { getSpacing, getColor, getRadius, getTransition, getTypography, getShadow } from '../utils';

interface ISwitchProps extends BaseComponentProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    label?: string;
    labelPosition?: 'left' | 'right';
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

class Switch extends PureComponent<ISwitchProps> {
    /**
     * Handle switch change event
     */
    private handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { onChange } = this.props;
        if (onChange) {
            onChange(e.target.checked);
        }
    };

    /**
     * Render switch content
     */
    private renderSwitchContent = (): ReactNode => {
        const { checked = false, disabled = false, size = 'md', theme } = this.props;

        const switchInputStyles = css`
            position: absolute;
            opacity: 0;
            cursor: pointer;
            
            &:disabled {
                cursor: not-allowed;
            }
        `;

        const switchTrackStyles = css`
            position: relative;
            width: ${getSpacing(theme || {} as any, size === 'sm' ? '2xl' : size === 'lg' ? '3xl' : '2.5xl')};
            height: ${getSpacing(theme || {} as any, size === 'sm' ? 'lg' : size === 'lg' ? 'xl' : '2xl')};
            background-color: ${disabled
                ? getColor(theme || {} as any, 'border.light')
                : checked
                    ? getColor(theme || {} as any, 'brand.500')
                    : getColor(theme || {} as any, 'border.light')
            };
            border-radius: ${getRadius(theme || {} as any, size === 'sm' ? 'sm' : size === 'lg' ? 'md' : 'sm')};
            transition: ${getTransition(theme || {} as any)};
        `;

        const switchThumbStyles = css`
            position: absolute;
            top: 50%;
            transform: translateY(-50%) translateX(${checked ?
                getSpacing(theme || {} as any, size === 'sm' ? 'lg' : size === 'lg' ? 'xl' : '2xl') : '0'
            });
            width: ${getSpacing(theme || {} as any, size === 'sm' ? 'sm' : size === 'lg' ? 'md' : 'sm')};
            height: ${getSpacing(theme || {} as any, size === 'sm' ? 'sm' : size === 'lg' ? 'md' : 'sm')};
            background-color: ${getColor(theme || {} as any, 'text.inverse')};
            border-radius: ${getRadius(theme || {} as any, 'full')};
            transition: ${getTransition(theme || {} as any, 'transform')};
            box-shadow: ${getShadow(theme || {} as any, 'sm')};
        `;

        return (
            <>
                <input
                    css={switchInputStyles}
                    type="checkbox"
                    checked={checked}
                    onChange={this.handleChange}
                    disabled={disabled}
                />
                <div css={switchTrackStyles}>
                    <div css={switchThumbStyles} />
                </div>
            </>
        );
    };

    override render(): ReactNode {
        const {
            label,
            labelPosition = 'right',
            disabled = false,
            size = 'md',
            className,
            style,
            testId,
            theme
        } = this.props;

        const switchContainerStyles = css`
            display: inline-flex;
            align-items: center;
            gap: ${getSpacing(theme || {} as any, size === 'sm' ? 'xs' : size === 'lg' ? 'sm' : 'sm')};
            cursor: ${disabled ? 'not-allowed' : 'pointer'};
            opacity: ${disabled ? 0.6 : 1};
        `;

        const switchLabelStyles = css`
            font-size: ${getTypography(theme || {} as any, size === 'sm' ? 'fontSize.xs' : size === 'lg' ? 'fontSize.base' : 'fontSize.sm')};
            color: ${getColor(theme || {} as any, 'text.primary')};
            user-select: none;
        `;

        if (label) {
            return (
                <div
                    css={switchContainerStyles}
                    className={className}
                    style={style}
                    data-testid={testId}
                >
                    {labelPosition === 'left' && (
                        <span css={switchLabelStyles}>{label}</span>
                    )}
                    {this.renderSwitchContent()}
                    {labelPosition === 'right' && (
                        <span css={switchLabelStyles}>{label}</span>
                    )}
                </div>
            );
        }

        return (
            <div
                css={switchContainerStyles}
                className={className}
                style={style}
                data-testid={testId}
            >
                {this.renderSwitchContent()}
            </div>
        );
    }
}

export default Switch;
