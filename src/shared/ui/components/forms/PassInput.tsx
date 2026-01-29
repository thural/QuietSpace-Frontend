import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import React, { PureComponent, ReactNode, ChangeEvent } from 'react';
import styled from 'styled-components';
import { EnhancedTheme } from '@/core/theme';

interface IPassInputProps extends GenericWrapper {
    name?: string;
    value?: string;
    handleChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

// Enterprise styled-components for password input styling
const PasswordInput = styled.input<{ theme: EnhancedTheme }>`
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

class PassInput extends PureComponent<IPassInputProps> {
    render(): ReactNode {
        const { name, value, handleChange, ...props } = this.props;

        return (
            <PasswordInput
                type='password'
                name={name}
                placeholder={name}
                value={value}
                onChange={handleChange}
            />
        );
    }
}

export default PassInput;