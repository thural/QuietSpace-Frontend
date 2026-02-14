/** @jsxImportSource @emotion/react */
import React, { PureComponent, ReactNode, createRef } from 'react';
import { IPinInputProps } from './interfaces';
import { createPinInputContainerStyles, createPinInputFieldStyles } from './styles';

interface IPinInputState {
    pinValues: string[];
}

/**
 * PinInput Component
 * 
 * A PIN input component with individual input fields for secure code entry.
 * Provides automatic focus management and paste handling.
 */
class PinInput extends PureComponent<IPinInputProps, IPinInputState> {
    private inputRefs = Array.from({ length: 6 }, () => createRef<HTMLInputElement>());

    constructor(props: IPinInputProps) {
        super(props);
        this.state = {
            pinValues: Array(props.length || 6).fill('')
        };
    }

    private handleInputChange = (index: number, value: string) => {
        const { length = 6, onChange } = this.props;
        
        // Only allow single character
        if (value.length > 1) return;
        
        // Only allow numbers if type is number
        if (this.props.type === 'number' && !/^\d*$/.test(value)) return;
        
        const newPinValues = [...this.state.pinValues];
        newPinValues[index] = value;
        
        this.setState({ pinValues: newPinValues });
        
        // Auto-focus next input
        if (value && index < length - 1) {
            this.inputRefs[index + 1].current?.focus();
        }
        
        // Call onChange with complete PIN
        if (onChange && newPinValues.every(val => val !== '')) {
            onChange(newPinValues.join(''));
        }
    };

    private handleKeyDown = (index: number, event: React.KeyboardEvent) => {
        const { length = 6 } = this.props;
        
        // Handle backspace
        if (event.key === 'Backspace' && !this.state.pinValues[index] && index > 0) {
            this.inputRefs[index - 1].current?.focus();
        }
        
        // Handle arrow keys
        if (event.key === 'ArrowLeft' && index > 0) {
            this.inputRefs[index - 1].current?.focus();
        }
        if (event.key === 'ArrowRight' && index < length - 1) {
            this.inputRefs[index + 1].current?.focus();
        }
    };

    private handlePaste = (event: React.ClipboardEvent) => {
        event.preventDefault();
        const { length = 6, onChange, type = 'text' } = this.props;
        
        const pastedData = event.clipboardData.getData('text');
        
        // Filter based on type
        const filteredData = type === 'number' 
            ? pastedData.replace(/\D/g, '').slice(0, length)
            : pastedData.slice(0, length);
        
        const newPinValues = filteredData.split('').concat(Array(length - filteredData.length).fill(''));
        
        this.setState({ pinValues: newPinValues });
        
        if (onChange) {
            onChange(filteredData);
        }
    };

    override render(): ReactNode {
        const { 
            length = 6, 
            value = '', 
            disabled = false, 
            size = 'md', 
            theme,
            className,
            testId 
        } = this.props;

        const containerStyles = createPinInputContainerStyles(theme, size);
        const fieldStyles = createPinInputFieldStyles(theme, size);

        return (
            <div 
                css={containerStyles}
                className={className}
                data-testid={testId}
                onPaste={this.handlePaste}
            >
                {Array.from({ length }, (_, index) => (
                    <input
                        key={index}
                        ref={this.inputRefs[index]}
                        type={this.props.type || 'text'}
                        css={fieldStyles}
                        value={this.state.pinValues[index] || ''}
                        onChange={(e) => this.handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => this.handleKeyDown(index, e)}
                        disabled={disabled}
                        maxLength={1}
                        inputMode={this.props.type === 'number' ? 'numeric' : 'text'}
                        autoComplete="off"
                    />
                ))}
            </div>
        );
    }
}

export default PinInput;
