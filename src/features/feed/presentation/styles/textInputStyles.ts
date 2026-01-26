/**
 * Text Input Component Styles - Modern Theme Integration
 * 
 * Enterprise styled-components with modern centralized theme system.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '@core/theme';

export const Textarea = styled.textarea<{
  theme: EnhancedTheme;
  minHeight?: string;
  hasError?: boolean;
  disabled?: boolean;
}>`
  width: 100%;
  outline: none;
  box-sizing: border-box;
  border: 1px solid ${(props: any) => props.hasError
    ? props.theme.colors.semantic.error
    : props.theme.colors.border.light
  };
  border-radius: ${(props: any) => props.theme.radius.md};
  padding: ${(props: any) => props.theme.spacing.sm};
  background-color: ${(props: any) => props.theme.colors.background.primary};
  color: ${(props: any) => props.theme.colors.text.primary};
  font-size: ${(props: any) => props.theme.typography.fontSize.base};
  resize: vertical;
  min-height: ${(props: any) => props.minHeight || '18vh'};
  transition: all 0.2s ease;

  &::placeholder {
    color: ${(props: any) => props.theme.colors.text.secondary};
    opacity: 0.7;
  }

  &:focus {
    outline: 2px solid ${(props: any) => props.hasError
    ? props.theme.colors.semantic.error
    : props.theme.colors.brand[500]
  };
    outline-offset: 2px;
    background-color: ${(props: any) => props.theme.colors.background.secondary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${(props: any) => props.theme.colors.background.primary};
    color: ${(props: any) => props.theme.colors.text.secondary};
  }
`;

export const TextInputContainer = styled.div<{ theme: EnhancedTheme }>`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${(props: any) => props.theme.spacing.xs};

  label {
    font-size: ${(props: any) => props.theme.typography.fontSize.sm};
    color: ${(props: any) => props.theme.colors.text.primary};
    margin-bottom: ${(props: any) => props.theme.spacing.xs};
  }

  .character-count {
    font-size: ${(props: any) => props.theme.typography.fontSize.sm};
    color: ${(props: any) => props.theme.colors.text.secondary};
    text-align: right;
    margin-top: ${(props: any) => props.theme.spacing.xs};
  }

  .error-message {
    font-size: ${(props: any) => props.theme.typography.fontSize.sm};
    color: ${(props: any) => props.theme.colors.semantic.error};
    margin-top: ${(props: any) => props.theme.spacing.xs};
  }
`;

export const TextInputWrapper = styled.div<{
  theme: EnhancedTheme;
  hasError?: boolean;
}>`
  position: relative;
  width: 100%;

  ${Textarea} {
    border: 1px solid ${(props: any) => props.hasError
    ? props.theme.colors.semantic.error
    : props.theme.colors.border.light
  };
    
    &:focus {
      border-color: ${(props: any) => props.hasError
    ? props.theme.colors.semantic.error
    : props.theme.colors.brand[500]
  };
    }
  }

  .icon-wrapper {
    position: absolute;
    top: ${(props: any) => props.theme.spacing.sm};
    right: ${(props: any) => props.theme.spacing.sm};
    color: ${(props: any) => props.theme.colors.text.secondary};
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .clear-button {
    position: absolute;
    top: ${(props: any) => props.theme.spacing.sm};
    right: ${(props: any) => props.theme.spacing.sm};
    background: none;
    border: none;
    color: ${(props: any) => props.theme.colors.text.secondary};
    cursor: pointer;
    padding: ${(props: any) => props.theme.spacing.xs};
    border-radius: ${(props: any) => props.theme.radius.sm};
    transition: all 0.2s ease;

    &:focus {
      outline: 2px solid ${(props: any) => props.theme.colors.brand[500]};
      outline-offset: 2px;
    }
  }
`;

// Modern export for backward compatibility
export const TextInputStyles = {
  textarea: Textarea,
  container: TextInputContainer,
  wrapper: TextInputWrapper,
};

export default TextInputStyles;
