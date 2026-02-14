/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode, ChangeEvent } from 'react';
import { ISwitchProps } from './interfaces';
import { createSwitchContainerStyles } from './styles';

/**
 * Switch Component
 * 
 * A toggle switch component with smooth animations.
 * Provides accessible toggle functionality with theme integration.
 */
class Switch extends PureComponent<ISwitchProps> {
    /**
     * Handle switch change event
     */
    private handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { onChange, disabled } = this.props;
        
        if (!disabled && onChange) {
            onChange(e.target.checked);
        }
    };

    override render(): ReactNode {
        const {
            checked = false,
            onChange,
            label,
            labelPosition = 'right',
            disabled = false,
            size = 'md',
            theme,
            className,
            testId
        } = this.props;

        const containerStyles = createSwitchContainerStyles(theme, size);

        return (
            <div css={containerStyles} className={className} data-testid={testId}>
                {label && labelPosition === 'left' && (
                    <label className="switch-label">{label}</label>
                )}

                <label className="switch-input">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={this.handleChange}
                        disabled={disabled}
                    />
                    <span className="switch-slider" />
                </label>

                {label && labelPosition === 'right' && (
                    <label className="switch-label">{label}</label>
                )}
            </div>
        );
    }
}

export default Switch;
