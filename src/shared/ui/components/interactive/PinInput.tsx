import React, { PureComponent, ReactNode, createRef } from 'react';
import styled from 'styled-components';
import { BaseComponentProps } from '../types';
import { getSpacing, getColor, getTypography, getRadius, getBorderWidth, getTransition, getSizeBasedSpacing, getInputFieldStyles } from '../utils';

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

const PinInputContainer = styled.div<{ $size: string; theme?: any }>`
  display: flex;
  gap: ${props => getSizeBasedSpacing(props.theme, props.$size as 'sm' | 'md' | 'lg')};
`;

const PinInputField = styled.input<{ $size: string; theme?: any }>`
  ${props => {
        const baseStyles = getInputFieldStyles(props.theme, props.$size as 'sm' | 'md' | 'lg');
        return `
      width: 3rem;
      height: 3rem;
      text-align: center;
      font-size: ${getTypography(props.theme, 'fontSize.lg')};
      font-weight: ${getTypography(props.theme, 'fontWeight.bold')};
      ${Object.entries(baseStyles).map(([key, value]) => `${key}: ${value}`).join('; ')};
      &:focus {
        ${baseStyles['&:focus']};
      }
      &:disabled {
        ${baseStyles['&:disabled']};
      }
    `;
    }}
`;
width: ${
    props => {
        switch (props.$size) {
            case 'sm': return getSpacing(props.theme, 32);
            case 'lg': return getSpacing(props.theme, 56);
            default: return getSpacing(props.theme, 48);
        }
    }
};
height: ${
    props => {
        switch (props.$size) {
            case 'sm': return getSpacing(props.theme, 32);
            case 'lg': return getSpacing(props.theme, 56);
            default: return getSpacing(props.theme, 48);
        }
    }
};
font - size: ${
    props => {
        switch (props.$size) {
            case 'sm': return getTypography(props.theme, 'fontSize.base');
            case 'lg': return getTypography(props.theme, 'fontSize.xl');
            default: return getTypography(props.theme, 'fontSize.lg');
        }
    }
};
text - align: center;
border: ${ props => getBorderWidth(props.theme, 'sm') } solid ${ props => getColor(props.theme, 'border.medium') };
border - radius: ${
    props => {
        switch (props.$size) {
            case 'sm': return getRadius(props.theme, 'sm');
            case 'lg': return getRadius(props.theme, 'md');
            default: return getRadius(props.theme, 'md');
        }
    }
};
background - color: ${ props => getColor(props.theme, 'background.primary') };
color: ${ props => getColor(props.theme, 'text.primary') };
transition: ${ props => getTransition(props.theme, 'all', 'fast', 'ease') };
  
  &:focus {
    outline: none;
    border - color: ${ props => getColor(props.theme, 'brand.500') };
    box - shadow: 0 0 0 ${ props => getBorderWidth(props.theme, 'md') } solid ${ props => getColor(props.theme, 'brand.200') };
}
  
  &:disabled {
    background - color: ${ props => getColor(props.theme, 'background.tertiary') };
    cursor: not - allowed;
}
  
  &::selection {
    background - color: ${ props => getColor(props.theme, 'brand.500') };
    color: ${ props => getColor(props.theme, 'text.inverse') };
}
`;

class PinInput extends PureComponent<IPinInputProps, IPinInputState> {
    private inputRefs: React.RefObject<HTMLInputElement>[];

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

            // Focus the next empty input or the last filled one
            const nextEmptyIndex = newPinValues.findIndex((val, i) => i > index && val === '');
            const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
            this.inputRefs[focusIndex].current?.focus();

            onChange?.(newPinValues.join(''));
        } else {
            // Handle single character input
            const newPinValues = [...pinValues];
            newPinValues[index] = filteredValue;
            this.setState({ pinValues: newPinValues });

            // Move to next input if a character was entered
            if (filteredValue && index < length - 1) {
                this.inputRefs[index + 1].current?.focus();
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
                this.inputRefs[index - 1].current?.focus();
                onChange?.(newPinValues.join(''));
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            e.preventDefault();
            this.inputRefs[index - 1].current?.focus();
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            e.preventDefault();
            this.inputRefs[index + 1].current?.focus();
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
        this.inputRefs[index].current = el;
    };

    override render(): ReactNode {
        const {
            length = 6,
            disabled = false,
            size = 'md',
            className,
            style,
            testId,
            type = 'number'
        } = this.props;

        const { pinValues } = this.state;

        return (
            <PinInputContainer
                className={className}
                style={style}
                data-testid={testId}
            >
                {Array.from({ length }, (_, index) => (
                    <PinInputField
                        key={index}
                        ref={this.setupRef(index)}
                        type={type}
                        value={pinValues[index] || ''}
                        onChange={(e) => this.handleChange(index, e.target.value)}
                        onKeyDown={(e) => this.handleKeyDown(index, e)}
                        onPaste={this.handlePaste}
                        disabled={disabled}
                        $size={size}
                        maxLength={1}
                        inputMode={type === 'number' ? 'numeric' : 'text'}
                        autoComplete="off"
                    />
                ))}
            </PinInputContainer>
        );
    }
}

export default PinInput;
