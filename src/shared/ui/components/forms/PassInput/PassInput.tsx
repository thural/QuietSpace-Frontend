/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { IPassInputProps } from './interfaces';
import { createPasswordInputStyles } from './styles';

/**
 * PassInput Component
 * 
 * A password input component with enterprise styling and theme integration.
 * Provides secure password input with proper accessibility and responsive design.
 */
class PassInput extends PureComponent<IPassInputProps> {
  override render(): ReactNode {
    const { name, value, handleChange, theme, ...props } = this.props;

    return (
      <input
        css={createPasswordInputStyles(theme)}
        type='password'
        name={name}
        placeholder={name}
        value={value}
        onChange={handleChange}
        {...props}
      />
    );
  }
}

export default PassInput;
