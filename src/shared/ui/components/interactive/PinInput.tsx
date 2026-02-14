/** @jsxImportSource @emotion/react */
import React, { PureComponent, ReactNode, createRef } from 'react';
import { css } from '@emotion/react';
import { BaseComponentProps } from '../types';
import { getColor, getTypography, getRadius, getBorderWidth, getTransition, getSizeBasedSpacing } from '../utils';

interface IPinInputProps extends BaseComponentProps {
    length?: number;
    value?: string;
    onChange?: (value: string) => void;
    type?: 'text' | 'number';
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

interface IPinInputState {
    pinValues: string[];
}

const createPinInputContainerStyles = (theme: any, size: 'sm' | 'md' | 'lg') => css`
  display: flex;
  gap: ${getSizeBasedSpacing(theme, size)};
`;

const createPinInputFieldStyles = (theme: any, size: 'sm' | 'md' | 'lg') => {
    const sizeStyles = {
        sm: { width: '2.5rem', height: '2.5rem', fontSize: getTypography(theme, 'fontSize.base') },
        lg: { width: '3.5rem', height: '3.5rem', fontSize: getTypography(theme, 'fontSize.xl') },
        md: { width: '3rem', height: '3rem', fontSize: getTypography(theme, 'fontSize.lg') }
    };

    const currentSize = sizeStyles[size];

    return css`
    width: ${currentSize.width};
    height: ${currentSize.height};
    font-size: ${currentSize.fontSize};
    text-align: center;
    border: ${getBorderWidth(theme, 'sm')} solid ${getColor(theme, 'border.medium')};
    border-radius: ${getRadius(theme, 'md')};
    background-color: ${getColor(theme, 'background.primary')};
    color: ${getColor(theme, 'text.primary')};
    transition: ${getTransition(theme, 'all')};
  
    &:focus {
      outline: none;
      border-color: ${getColor(theme, 'brand.500')};
      box-shadow: 0 0 0 2px ${getColor(theme, 'brand.500')}20;
    }
  
    &:disabled {
      background-color: ${getColor(theme, 'background.tertiary')};
      cursor: not-allowed;
    }
  
    &::selection {
      background-color: ${getColor(theme, 'brand.500')};
      color: ${getColor(theme, 'text.inverse')};
    }
  `;
};

class PinInput extends PureComponent<IPinInputProps, IPinInputState> {
    private inputRefs: React.RefObject<HTMLInputElement | null>[];

    constructor(props: IPinInputProps) {
        super(props);

        const { length = 6, value = '' } = props;

        // Initialize refs
        this.inputRefs = Array.from({ length }, () => createRef<HTMLInputElement>());

        // Initialize state
        const values = value.split('').slice(0, length);
        const paddedValues = [...values, ...Array(length - values.length).fill('')];
        this.state = {
            pinValues: paddedValues
        };
    }

    override componentDidUpdate(prevProps: IPinInputProps): void {
        const { length = 6, value = '' } = this.props;
        const { length: prevLength = 6, value: prevValue = '' } = prevProps;

        if (value !== prevValue || length !== prevLength) {
            const values = value.split('').slice(0, length);
            const paddedValues = [...values, ...Array(length - values.length).fill('')];
            this.setState({ pinValues: paddedValues });
        }
    }

    /**
     * Handle input change
     */
    private handleChange = (index: number, inputValue: string): void => {
        const { type = 'number', length = 6, onChange } = this.props;
        const { pinValues } = this.state;

        // Filter input based on type
        const filteredValue = type === 'number'
            ? inputValue.replace(/[^0-9]/g, '')
            : inputValue.replace(/[^a-zA-Z0-9]/g, '');

        if (filteredValue.length > 1) {
            // Handle paste case
            const values = filteredValue.split('').slice(0, length - index);
            const newPinValues = [...pinValues];
            values.forEach((val, i) => {
                if (index + i < length) {
                    newPinValues[index + i] = val;
                }
            });
            this.setState({ pinValues: newPinValues });

            // Focus next empty input or last filled one
            const nextEmptyIndex = newPinValues.findIndex((val, i) => i > index && val === '');
            const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
            const ref = this.inputRefs[focusIndex];
            if (ref?.current) {
                ref.current.focus();
            }

            onChange?.(newPinValues.join(''));
        } else {
            // Handle single character input
            const newPinValues = [...pinValues];
            newPinValues[index] = filteredValue;
            this.setState({ pinValues: newPinValues });

            // Move to next input if a character was entered
            if (filteredValue && index < length - 1) {
                const nextRef = this.inputRefs[index + 1];
                if (nextRef?.current) {
                    nextRef.current.focus();
                }
            }

            onChange?.(newPinValues.join(''));
        }
    };

    /**
     * Handle keyboard events
     */
    private handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
        const { length = 6, onChange } = this.props;
        const { pinValues } = this.state;

        if (e.key === 'Backspace') {
            e.preventDefault();
            const newPinValues = [...pinValues];

            if (pinValues[index]) {
                // Clear current input
                newPinValues[index] = '';
                this.setState({ pinValues: newPinValues });
                onChange?.(newPinValues.join(''));
            } else if (index > 0) {
                // Move to previous input and clear it
                newPinValues[index - 1] = '';
                this.setState({ pinValues: newPinValues });
                const prevRef = this.inputRefs[index - 1];
                if (prevRef?.current) {
                    prevRef.current.focus();
                }
                onChange?.(newPinValues.join(''));
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            e.preventDefault();
            const leftRef = this.inputRefs[index - 1];
            if (leftRef?.current) {
                leftRef.current.focus();
            }
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            e.preventDefault();
            const rightRef = this.inputRefs[index + 1];
            if (rightRef?.current) {
                rightRef.current.focus();
            }
        }
    };

    /**
     * Handle paste events
     */
    private handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
        e.preventDefault();
        const { type = 'number' } = this.props;

        const pastedData = e.clipboardData.getData('text');
        const filteredValue = type === 'number'
            ? pastedData.replace(/[^0-9]/g, '')
            : pastedData.replace(/[^a-zA-Z0-9]/g, '');

        this.handleChange(0, filteredValue);
    };

    /**
     * Setup ref for input element
     */
    private setupRef = (index: number): (el: HTMLInputElement | null) => void => {
        return (el: HTMLInputElement | null) => {
            const ref = this.inputRefs[index];
            if (ref) {
                ref.current = el;
            }
        };
    };

    override render(): ReactNode {
        const { theme, ...restProps } = this.props;
        const {
            length = 6,
            disabled = false,
            size = 'md',
            className,
            style,
            testId,
            type = 'number'
        } = restProps;

        const { pinValues } = this.state;

        return (
            <div
                css={createPinInputContainerStyles(theme || {} as any, size)}
                className={className}
                style={style}
                data-testid={testId}
            >
                {Array.from({ length }, (_, index) => (
                    <input
                        key={index}
                        ref={this.setupRef(index)}
                        css={createPinInputFieldStyles(theme || {} as any, size)}
                        type={type}
                        value={pinValues[index] || ''}
                        onChange={(e) => this.handleChange(index, e.target.value)}
                        onKeyDown={(e) => this.handleKeyDown(index, e)}
                        onPaste={this.handlePaste}
                        disabled={disabled}
                        maxLength={1}
                        inputMode={type === 'number' ? 'numeric' : 'text'}
                        autoComplete="off"
                    />
                ))}
            </div>
        );
    }
}

export default PinInput;
