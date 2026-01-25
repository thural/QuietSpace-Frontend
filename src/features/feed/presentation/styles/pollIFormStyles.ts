/**
 * Poll Form Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and enhanced theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const PollForm = styled.div<{ theme: EnhancedTheme; isVisible?: boolean }>`
  display: ${(props: any) => props.isVisible ? 'flex' : 'none'};
  flex-flow: column nowrap;
  gap: ${(props: any) => props.theme.spacing.md};
  padding: ${(props: any) => props.theme.spacing.lg};
  background-color: ${(props: any) => props.theme.colors.background.primary};
  border-radius: ${(props: any) => props.theme.radius.md};
  border: 1px solid ${(props: any) => props.theme.colors.border.light};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props: any) => props.theme.colors.border.base};
    box-shadow: ${(props: any) => props.theme.shadows.sm};
  }

  input {
    width: 100%;
    height: 2.5rem;
    box-sizing: border-box;
    font-weight: ${(props: any) => props.theme.typography.fontWeight.bold};
    padding: 0 ${(props: any) => props.theme.spacing.sm};
    border: 1px solid ${(props: any) => props.theme.colors.border.light};
    background-color: ${(props: any) => props.theme.colors.background.secondary};
    border-radius: ${(props: any) => props.theme.radius.sm};
    font-size: ${(props: any) => props.theme.typography.fontSize.base};
    color: ${(props: any) => props.theme.colors.text.primary};
    transition: all 0.2s ease;

    &::placeholder {
      color: ${(props: any) => props.theme.colors.text.secondary};
      opacity: 0.7;
    }

    &:focus {
      outline: none;
      border-color: ${(props: any) => props.theme.colors.brand[500]};
      box-shadow: 0 0 0 2px ${(props: any) => props.theme.colors.brand[500]}20;
      background-color: ${(props: any) => props.theme.colors.background.secondary};
    }

    &:hover {
      border-color: ${(props: any) => props.theme.colors.border.base};
      background-color: ${(props: any) => props.theme.colors.background.primary};
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background-color: ${(props: any) => props.theme.colors.background.secondary};
    }

    &:invalid {
      border-color: ${(props: any) => props.theme.colors.semantic.error};
      background-color: ${(props: any) => props.theme.colors.semantic.error}10;
    }
  }

  .close-poll {
    cursor: pointer;
    font-size: 0.9rem;
    margin-left: auto;
    color: ${(props: any) => props.theme.colors.text.secondary};
    padding: ${(props: any) => props.theme.spacing.xs};
    border-radius: ${(props: any) => props.theme.radius.sm};
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    min-height: 24px;

    &:hover {
      background-color: ${(props: any) => props.theme.colors.background.secondary};
      color: ${(props: any) => props.theme.colors.semantic.error};
    }

    &:active {
      transform: scale(0.95);
    }

    svg {
      font-size: ${(props: any) => props.theme.typography.fontSize.base};
    }
  }
`;

export const PollFormHeader = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(props: any) => props.theme.spacing.md};

  h3 {
    font-size: ${(props: any) => props.theme.typography.fontSize.base};
    font-weight: ${(props: any) => props.theme.typography.fontWeight.bold};
    color: ${(props: any) => props.theme.colors.text.primary};
    margin: 0;
  }
`;

export const PollFormBody = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  flex-direction: column;
  gap: ${(props: any) => props.theme.spacing.md};
`;

export const PollFormFooter = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(props: any) => props.theme.spacing.sm};
  padding-top: ${(props: any) => props.theme.spacing.md};
  border-top: 1px solid ${(props: any) => props.theme.colors.border.light};

  @media (max-width: ${(props: any) => props.theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${(props: any) => props.theme.spacing.md};
  }
`;

export const PollOptionInput = styled.input<{ theme: EnhancedTheme; hasError?: boolean }>`
  width: 100%;
  height: 2.5rem;
  box-sizing: border-box;
  font-weight: ${(props: any) => props.theme.typography.fontWeight.normal};
  padding: 0 ${(props: any) => props.theme.spacing.sm};
  border: 1px solid ${(props: any) => props.hasError ? props.theme.colors.semantic.error : props.theme.colors.border.light};
  background-color: ${(props: any) => props.theme.colors.background.secondary};
  border-radius: ${(props: any) => props.theme.radius.sm};
  font-size: ${(props: any) => props.theme.typography.fontSize.base};
  color: ${(props: any) => props.theme.colors.text.primary};
  transition: all 0.2s ease;

  &::placeholder {
    color: ${(props: any) => props.theme.colors.text.secondary};
    opacity: 0.7;
  }

  &:focus {
    outline: none;
    border-color: ${(props: any) => props.hasError ? props.theme.colors.semantic.error : props.theme.colors.brand[500]};
    box-shadow: 0 0 0 2px ${(props: any) => props.hasError ? props.theme.colors.semantic.error : props.theme.colors.brand[500]}20;
    background-color: ${(props: any) => props.theme.colors.background.secondary};
  }

  &:hover {
    border-color: ${(props: any) => props.hasError ? props.theme.colors.semantic.error : props.theme.colors.border.base};
    background-color: ${(props: any) => props.theme.colors.background.primary};
  }
`;

export const PollOptionContainer = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  gap: ${(props: any) => props.theme.spacing.sm};
  position: relative;

  .option-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: ${(props: any) => props.theme.colors.brand[500]};
    color: ${(props: any) => props.theme.colors.text.primary};
    border-radius: ${(props: any) => props.theme.radius.sm};
    font-size: ${(props: any) => props.theme.typography.fontSize.sm};
    font-weight: ${(props: any) => props.theme.typography.fontWeight.bold};
    flex-shrink: 0;
  }

  .remove-option {
    cursor: pointer;
    color: ${(props: any) => props.theme.colors.semantic.error};
    padding: ${(props: any) => props.theme.spacing.xs};
    border-radius: ${(props: any) => props.theme.radius.sm};
    transition: all 0.2s ease;

    &:hover {
      background-color: ${(props: any) => props.theme.colors.semantic.error}10;
    }

    &:active {
      transform: scale(0.95);
    }
  }
`;

export const AddOptionButton = styled.button<{ theme: EnhancedTheme }>`
  background: none;
  border: 1px dashed ${(props: any) => props.theme.colors.border.base};
  border-radius: ${(props: any) => props.theme.radius.sm};
  padding: ${(props: any) => props.theme.spacing.sm};
  cursor: pointer;
  color: ${(props: any) => props.theme.colors.text.secondary};
  font-size: ${(props: any) => props.theme.typography.fontSize.sm};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${(props: any) => props.theme.spacing.xs};

  &:hover {
    border-color: ${(props: any) => props.theme.colors.brand[500]};
    color: ${(props: any) => props.theme.colors.brand[500]};
    background-color: ${(props: any) => props.theme.colors.brand[500]}10;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    font-size: ${(props: any) => props.theme.typography.fontSize.base};
  }
`;

// Legacy export for backward compatibility during migration
export const PollIFormStyles = {
  pollForm: PollForm,
  header: PollFormHeader,
  body: PollFormBody,
  footer: PollFormFooter,
  optionInput: PollOptionInput,
  optionContainer: PollOptionContainer,
  addOptionButton: AddOptionButton,
};

export default PollIFormStyles;
