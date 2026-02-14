import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { ChangeEvent, ReactNode } from 'react';
import { ITextInputStyledProps, ITextInputStyledState } from './interfaces';
import { TextInputStyles } from './styles';

/**
 * Extended props interface for TextInputStyled component
 */
interface ITextInputStyledExtendedProps extends ITextInputStyledProps, IBaseComponentProps {
  /** Additional className for styling */
  className?: string;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Extended state interface for TextInputStyled component
 */
interface ITextInputStyledExtendedState extends ITextInputStyledState, IBaseComponentState {
  /** Additional state properties if needed */
}

/**
 * Enterprise TextInputStyled Component
 * 
 * Replaces styled-components based TextInput with Emotion CSS
 * following theme system patterns and class component best practices.
 * Follows enterprise architecture patterns with proper decoupling.
 */
export class TextInputStyled extends BaseClassComponent<ITextInputStyledExtendedProps, ITextInputStyledExtendedState> {
  static defaultProps: Partial<ITextInputStyledExtendedProps> = {
    maxLength: "999",
    minLength: "0",
    hidden: false,
    isStyled: true
  };

  protected override getInitialState(): Partial<ITextInputStyledExtendedState> {
    return {};
  }

  private handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { handleChange } = this.props;
    if (handleChange) {
      handleChange(event.target.value);
    }
  };

  protected override renderContent(): ReactNode {
    const {
      name = "",
      value,
      placeholder,
      maxLength = "999",
      minLength = "0",
      hidden = false,
      isStyled = true,
      className,
      testId = 'text-input-styled',
      theme,
      ...rest
    } = this.props;

    return (
      <input
        css={isStyled ? TextInputStyles(theme || {} as any) : undefined}
        type='text'
        name={name}
        placeholder={placeholder ? placeholder : name}
        value={value}
        onChange={this.handleChange}
        hidden={hidden}
        maxLength={parseInt(maxLength)}
        minLength={parseInt(minLength)}
        className={className}
        data-testid={testId}
        {...rest}
      />
    );
  }
}

export default TextInputStyled;
