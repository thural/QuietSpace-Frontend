/**
 * Title Input Component Styles - Modern Theme Integration
 * 
 * Enterprise styled-components with modern centralized theme system.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const TitleInput = styled.input<{
    theme: EnhancedTheme;
    variant?: 'h1' | 'h2' | 'h3';
}>`
  width: 100%;
  border: none;
  height: ${(props: any) => props.theme.spacing.lg};
  box-sizing: border-box;
  font-weight: ${(props: any) => props.theme.typography.fontWeight.bold};
  margin-bottom: ${(props: any) => props.theme.spacing.sm};
  background-color: ${(props: any) => props.theme.colors.background.primary};
  color: ${(props: any) => props.theme.colors.text.primary};
  font-size: ${(props: any) => {
        switch (props.variant) {
            case 'h1':
                return props.theme.typography.fontSize['3xl'];
            case 'h2':
                return props.theme.typography.fontSize['2xl'];
            case 'h3':
                return props.theme.typography.fontSize.xl;
            default:
                return props.theme.typography.fontSize.xl;
        }
    }};
  font-family: ${(props: any) => props.theme.typography.fontFamily.sans.join(', ')};
  line-height: ${(props: any) => props.theme.typography.lineHeight.normal};
  padding: 0 ${(props: any) => props.theme.spacing.sm};
  border-radius: ${(props: any) => props.theme.radius.sm};
  transition: all 0.2s ease;

  &::placeholder {
    color: ${(props: any) => props.theme.colors.text.secondary};
    opacity: 0.7;
    font-weight: ${(props: any) => props.theme.typography.fontWeight.normal};
  }

  &:focus {
    outline: none;
    border: 2px solid ${(props: any) => props.theme.colors.brand[500]};
    background-color: ${(props: any) => props.theme.colors.background.secondary};
    box-shadow: ${(props: any) => props.theme.shadows.sm};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${(props: any) => props.theme.colors.background.primary};
  }

  &:invalid {
    border-color: ${(props: any) => props.theme.colors.semantic.error};
    background-color: ${(props: any) => props.theme.colors.semantic.error}10;
  }
`;

export const TitleInputContainer = styled.div<{ theme: EnhancedTheme }>`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${(props: any) => props.theme.spacing.xs};

  .input-label {
    font-size: ${(props: any) => props.theme.typography.fontSize.sm};
    font-weight: ${(props: any) => props.theme.typography.fontWeight.normal};
    color: ${(props: any) => props.theme.colors.text.primary};
    margin-bottom: ${(props: any) => props.theme.spacing.xs};
    display: flex;
    align-items: center;
    gap: ${(props: any) => props.theme.spacing.xs};

    .required-indicator {
      color: ${(props: any) => props.theme.colors.semantic.error};
      font-weight: ${(props: any) => props.theme.typography.fontWeight.bold};
    }
  }

  .character-count {
    font-size: ${(props: any) => props.theme.typography.fontSize.sm};
    color: ${(props: any) => props.theme.colors.text.secondary};
    text-align: right;
    margin-top: ${(props: any) => props.theme.spacing.xs};
    align-self: flex-end;
  }

  .helper-text {
    font-size: ${(props: any) => props.theme.typography.fontSize.sm};
    color: ${(props: any) => props.theme.colors.text.secondary};
    margin-top: ${(props: any) => props.theme.spacing.xs};
  }

  .error-message {
    font-size: ${(props: any) => props.theme.typography.fontSize.sm};
    color: ${(props: any) => props.theme.colors.semantic.error};
    margin-top: ${(props: any) => props.theme.spacing.xs};
    display: flex;
    align-items: center;
    gap: ${(props: any) => props.theme.spacing.xs};
  }
`;

export const TitleInputWrapper = styled.div<{
    theme: EnhancedTheme;
    hasError?: boolean;
}>`
  position: relative;
  width: 100%;

  ${TitleInput} {
    border: 1px solid ${(props: any) => props.hasError
        ? props.theme.colors.semantic.error
        : 'transparent'
    };
    
    &:focus {
      border-color: ${(props: any) => props.hasError
        ? props.theme.colors.semantic.error
        : props.theme.colors.brand[500]
    };
    }
  }

  .input-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: ${(props: any) => props.theme.spacing.sm};
    color: ${(props: any) => props.theme.colors.text.secondary};
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${(props: any) => props.theme.typography.fontSize.lg};
  }

  .clear-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: ${(props: any) => props.theme.spacing.sm};
    background: none;
    border: none;
    color: ${(props: any) => props.theme.colors.text.secondary};
    cursor: pointer;
    padding: ${(props: any) => props.theme.spacing.xs};
    border-radius: ${(props: any) => props.theme.radius.sm};
    transition: all 0.2s ease;
    font-size: ${(props: any) => props.theme.typography.fontSize.lg};

    &:hover {
      background-color: ${(props: any) => props.theme.colors.background.secondary};
      color: ${(props: any) => props.theme.colors.text.primary};
    }

    &:focus {
      outline: 2px solid ${(props: any) => props.theme.colors.brand[500]};
      outline-offset: 2px;
    }
  }
`;

export const TitleInputPreview = styled.div<{ theme: EnhancedTheme }>`
  margin-top: ${(props: any) => props.theme.spacing.md};
  padding: ${(props: any) => props.theme.spacing.md};
  background-color: ${(props: any) => props.theme.colors.background.secondary};
  border-radius: ${(props: any) => props.theme.radius.md};
  border: 1px solid ${(props: any) => props.theme.colors.border.light};
  
  .preview-title {
    font-size: ${(props: any) => props.theme.typography.fontSize.base};
    font-weight: ${(props: any) => props.theme.typography.fontWeight.bold};
    color: ${(props: any) => props.theme.colors.text.primary};
    margin-bottom: ${(props: any) => props.theme.spacing.sm};
  }

  .preview-content {
    font-size: ${(props: any) => props.theme.typography.fontSize.base};
    color: ${(props: any) => props.theme.colors.text.secondary};
    line-height: ${(props: any) => props.theme.typography.lineHeight.normal};
  }
`;

// Modern export for backward compatibility
export const TitleInputStyles = {
    titleInput: TitleInput,
    container: TitleInputContainer,
    wrapper: TitleInputWrapper,
    preview: TitleInputPreview,
};

export default TitleInputStyles;
