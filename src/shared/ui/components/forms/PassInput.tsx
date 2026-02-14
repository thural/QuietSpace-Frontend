/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import { ChangeEvent, PureComponent, ReactNode } from 'react';
import { getBorderWidth, getBreakpoint, getColor, getRadius, getSpacing, getTransition, getTypography } from '../utils';

// Enterprise Emotion CSS for password input styling
const passwordInputStyles = (theme?: any) => css`
  width: 100%;
  padding: ${getSpacing(theme, 'md')};
  font-size: ${getTypography(theme, 'fontSize.base')};
  font-family: ${theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
  color: ${getColor(theme, 'text.primary')};
  background: ${getColor(theme, 'background.primary')};
  border: ${getBorderWidth(theme, 'sm')} solid ${getColor(theme, 'border.medium')};
  border-radius: ${getRadius(theme, 'md')};
  transition: ${getTransition(theme, 'all', 'normal', 'ease')};
  
  &::placeholder {
    color: ${getColor(theme, 'text.tertiary')};
  }
  
  &:focus {
    outline: none;
    border-color: ${getColor(theme, 'brand.500')};
    box-shadow: 0 0 0 ${getSpacing(theme, 3)} solid ${getColor(theme, 'brand.200')};
  }
  
  &:hover:not(:focus) {
    border-color: ${getColor(theme, 'border.dark')};
  }
  
  &:disabled {
    background: ${getColor(theme, 'background.tertiary')};
    color: ${getColor(theme, 'text.tertiary')};
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  // Responsive design
  @media (max-width: ${getBreakpoint(theme, 'sm')}) {
    padding: ${getSpacing(theme, 'sm')};
    font-size: ${getTypography(theme, 'fontSize.sm')};
  }
`;

interface IPassInputProps extends GenericWrapper {
  name?: string;
  value?: string;
  handleChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  theme?: any;
}

class PassInput extends PureComponent<IPassInputProps> {
  override render(): ReactNode {
    const { name, value, handleChange, theme, ...props } = this.props;

    return (
      <input
        css={passwordInputStyles(theme)}
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