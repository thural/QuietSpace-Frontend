/**
 * Forms Components Index
 * 
 * Exports all form components from the shared UI library.
 * Includes Form, FormField, and future form-related components.
 */

export { Form } from './Form';
export type { IFormConfig, IFormField, IFormValidationRule } from './Form';

export { FormField } from './FormField';
export type { IFormFieldProps, IFormFieldState, IFormFieldValidationRule as IFormFieldValidationRuleType } from './FormField';

// PassInput component with new decoupled structure
export { default as PassInput } from './PassInput';
export type { IPassInputProps } from './PassInput';

// EmojiInput component with new decoupled structure
export { default as EmojiInput } from './EmojiInput';
export type { IEmojiInputProps } from './EmojiInput';

// InputStyled component with new decoupled structure
export { default as InputStyled } from './InputStyled';
export type { IInputStyledProps } from './InputStyled';

// TextAreaStyled component with new decoupled structure
export { default as TextAreaStyled } from './TextAreaStyled';
export type { TextAreaStyledProps } from './TextAreaStyled';

// SwitchStyled component with new decoupled structure
export { default as SwitchStyled } from './SwitchStyled';
export type { ISwitchStyledProps } from './SwitchStyled';

// CheckBox component with new decoupled structure
export { CheckBox } from './CheckBox';
export type { ICheckBoxProps, ICheckBoxState } from './CheckBox/interfaces';

// CheckboxComponent component (legacy, will be deprecated)
export { default as CheckboxComponent } from './CheckboxComponent';

// HiddenFileInput component with new decoupled structure
export { HiddenFileInput } from './HiddenFileInput';
export type { IHiddenFileInputProps, IHiddenFileInputState } from './HiddenFileInput';

// SearchInput component with new decoupled structure
export { SearchInput } from './SearchInput';
export type { ISearchInputProps, ISearchInputState, ISearchSuggestion } from './SearchInput';

// StyledButton component with new decoupled structure
export { StyledButton } from './StyledButton';
export type { IStyledButtonProps, IStyledButtonState } from './StyledButton';

// TextInputStyled component with new decoupled structure
export { TextInputStyled } from './TextInputStyled';
export type { ITextInputStyledProps, ITextInputStyledState } from './TextInputStyled';

// DateRangePicker component with new decoupled structure
export { DateRangePicker } from './DateRangePicker';
export type { IDateRange, IDateRangePickerProps, IDateRangePickerState } from './DateRangePicker';

// TwoFactorAuth component with new decoupled structure
export { TwoFactorAuth } from './TwoFactorAuth';
export type { ITwoFactorAuthProps, ITwoFactorAuthState } from './TwoFactorAuth';

// FileUploader component with new decoupled structure
export { FileUploader } from './FileUploader';
export type { IFileUploaderProps, IFileUploaderState } from './FileUploader';
