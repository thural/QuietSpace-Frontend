import { ConsumerFn } from "@/shared/types/genericTypes";
import React from "react";
import styled from 'styled-components';
import { EnhancedTheme } from '@/core/theme';
import { GenericWrapper } from "@shared-types/sharedComponentTypes";

interface TextInputStyledProps extends GenericWrapper {
    name: string,
    value: string | number,
    handleChange: (value: string | number) => void,
    placeholder?: string,
    maxLength?: string,
    minLength?: string,
    hidden?: boolean,
    isStyled?: boolean
}


// Enterprise styled-components for text input styling
const TextInput = styled.input<{ theme: EnhancedTheme }>`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-family: ${props => props.theme.typography.fontFamily.sans.join(', ')};
  color: ${props => props.theme.colors.text.primary};
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.radius.md};
  transition: all ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};
  
  &::placeholder {
    color: ${props => props.theme.colors.text.tertiary};
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.brand[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.brand[200]};
  }
  
  &:hover:not(:focus) {
    border-color: ${props => props.theme.colors.border.dark};
  }
  
  &:disabled {
    background: ${props => props.theme.colors.background.tertiary};
    color: ${props => props.theme.colors.text.tertiary};
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: ${props => props.theme.spacing.sm};
    font-size: ${props => props.theme.typography.fontSize.sm};
  }
`;

const TextInputStyled: React.FC<TextInputStyledProps> = ({
    name = "",
    value,
    handleChange,
    placeholder,
    maxLength = "999",
    minLength = "0",
    hidden = false,
    isStyled = true,
    ...props
}) => {
    return (
        <TextInput
            type='text'
            name={name}
            placeholder={placeholder ? placeholder : name}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            hidden={hidden}
            maxLength={parseInt(maxLength)}
            minLength={parseInt(minLength)}
        />
    );
};

export default TextInputStyled