import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { ChangeEvent, ReactNode } from 'react';
import { Container } from '@/shared/ui/components/layout/Container';
import { ICheckBoxProps, ICheckBoxState } from './interfaces';
import { CheckBoxWrapper, CheckBoxInput } from './styles';

/**
 * Extended props interface for CheckBox component
 */
interface ICheckBoxExtendedProps extends ICheckBoxProps, IBaseComponentProps {
  /** Additional className for styling */
  className?: string;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Extended state interface for CheckBox component
 */
interface ICheckBoxExtendedState extends ICheckBoxState, IBaseComponentState {
  /** Additional state properties if needed */
}

/**
 * Enterprise CheckBox Component
 * 
 * A reusable checkbox component that follows the enterprise architecture patterns.
 * Features proper decoupling, BaseClassComponent inheritance, and Emotion CSS styling.
 */
export class CheckBox extends BaseClassComponent<ICheckBoxExtendedProps, ICheckBoxExtendedState> {
  static defaultProps: Partial<ICheckBoxExtendedProps> = {
    size: 'md',
    disabled: false,
    error: false,
    checked: false
  };

  protected override getInitialState(): Partial<ICheckBoxExtendedState> {
    return {
      checked: false,
      isFocused: false
    };
  }

  private handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { onChange } = this.props;
    const checked = event.target.checked;
    
    // Update internal state
    this.setState({ checked });
    
    // Call external onChange handler
    if (onChange) {
      onChange(event);
    }
  };

  private handleFocus = (): void => {
    this.setState({ isFocused: true });
  };

  private handleBlur = (): void => {
    this.setState({ isFocused: false });
  };

  protected override renderContent(): ReactNode {
    const {
      value,
      size = 'md',
      disabled = false,
      error = false,
      theme,
      className,
      testId = 'checkbox'
    } = this.props;

    const { checked, isFocused } = this.state;

    return (
      <Container theme={theme} className={className}>
        <div css={CheckBoxWrapper(theme || {} as any)}>
          <input
            css={CheckBoxInput(theme || {} as any, size, error)}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            value={value}
            data-testid={testId}
            aria-checked={checked}
            aria-disabled={disabled}
          />
        </div>
      </Container>
    );
  }
}

export default CheckBox;
