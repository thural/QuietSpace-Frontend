/**
 * Forms Components Index
 * 
 * Exports all form components from the shared UI library.
 * Includes Form, FormField, and future form-related components.
 */

export { Form } from './Form';
export type { IFormConfig, IFormField, IFormValidationRule } from './Form';

export { FormField } from './FormField';
export type { IFormFieldProps, IFormFieldValidationRule as IFormFieldValidationRuleType } from './FormField';

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
