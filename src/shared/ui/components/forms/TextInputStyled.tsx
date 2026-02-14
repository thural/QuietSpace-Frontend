/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode, ChangeEvent } from "react";
import { css } from '@emotion/react';
import { EnhancedTheme } from '../../../../../core/modules/theming/types/ProviderTypes';
import { GenericWrapper } from "@shared-types/sharedComponentTypes";

interface ITextInputStyledProps extends GenericWrapper {
  name: string;
  value: string | number;
  handleChange: (value: string | number) => void;
  placeholder?: string;
  maxLength?: string;
  minLength?: string;
  hidden?: boolean;
  isStyled?: boolean;
}

/**
 * Enterprise TextInput Component
 * 
 * Replaces styled-components based TextInput with Emotion CSS
 * following theme system patterns and class component best practices.
 */
class TextInputStyled extends PureComponent<ITextInputStyledProps> {
  override render(): ReactNode {
    const {
      name = "",
      value,
      handleChange,
      placeholder,
      maxLength = "999",
      minLength = "0",
      hidden = false,
      isStyled = true,
      ...props
    } = this.props;

    const textInputStyles = (theme: EnhancedTheme) => css`
            width: 100%;
            padding: ${theme.spacing.md};
            font-size: ${theme.typography.fontSize.base};
            font-family: ${theme.typography.fontFamily.sans.join(',')};
            color: ${theme.colors.text.primary};
            background: ${theme.colors.background.primary};
            border: 1px solid ${theme.colors.border.medium};
            border-radius: ${theme.radius.md};
            transition: all ${theme.animation.duration.normal} ${theme.animation.easing.ease};
            
            &::placeholder {
                color: ${theme.colors.text.tertiary};
            }
            
            &:focus {
                outline: none;
                border-color: ${theme.colors.brand[500]};
                box-shadow: 0 0 0 3px ${theme.colors.brand[200]};
            }
            
            &:hover:not(:focus) {
                border-color: ${theme.colors.border.dark};
            }
            
            &:disabled {
                background: ${theme.colors.background.tertiary};
                color: ${theme.colors.text.tertiary};
                cursor: not-allowed;
                opacity: 0.6;
            }
            
            /* Responsive design */
            @media (max-width: ${theme.breakpoints.sm}) {
                padding: ${theme.spacing.sm};
                font-size: ${theme.typography.fontSize.sm};
            }
        `;

    return (
      <input
        css={textInputStyles(props.theme || {} as any)}
        type='text'
        name={name}
        placeholder={placeholder ? placeholder : name}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
        hidden={hidden}
        maxLength={parseInt(maxLength)}
        minLength={parseInt(minLength)}
        {...props}
      />
    );
  }
}

export default TextInputStyled;