/**
 * Message Input Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and enhanced theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const InputSection = styled.div<{ theme: EnhancedTheme }>`
  z-index: 1;
  margin-top: auto;
`;

export const MessageInput = styled.textarea<{ theme: EnhancedTheme }>`
  width: 100%;
  border: none;
  height: auto;
  resize: none;
  outline: none;
  padding: 10px;
  overflow: hidden;
  box-sizing: border-box;
  max-height: 200px;
  border-radius: ${props => props.theme.radius.sm};
  background-color: transparent;
  color: ${props => props.theme.colors.text.primary};
  font-family: inherit;
  font-size: ${props => props.theme.typography.fontSize.base};
  
  &::placeholder {
    color: ${props => props.theme.colors.text.tertiary};
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.brand[500]};
    outline-offset: 2px;
  }
`;

export const InputForm = styled.form<{ theme: EnhancedTheme }>`
  gap: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.primary};
  width: 100%;
  height: 100%;
  margin: auto;
  display: flex;
  flex-flow: row nowrap;
  box-sizing: border-box;
  align-items: center;
  background-color: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.md};
  padding: ${props => props.theme.spacing.sm};
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};

  & button {
    color: ${props => props.theme.colors.text.inverse};
    width: fit-content;
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
    font-size: ${props => props.theme.typography.fontSize.base};
    font-weight: ${props => props.theme.typography.fontWeight.medium};
    display: flex;
    background-color: ${props => props.theme.colors.brand[600]};
    border: 1px solid ${props => props.theme.colors.brand[600]};
    border-radius: ${props => props.theme.radius.sm};
    cursor: pointer;
    transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
    
    &:hover {
      background-color: ${props => props.theme.colors.brand[700]};
      border-color: ${props => props.theme.colors.brand[700]};
    }
    
    &:active {
      transform: translateY(1px);
    }
  }

  & .input {
    display: flex;
    flex-flow: column nowrap;
    gap: ${props => props.theme.spacing.xs};
  }

  & input {
    box-sizing: border-box;
    width: 100%;
    padding: 10px;
    height: 1.8rem;
    background-color: ${props => props.theme.colors.background.secondary};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.radius.lg};
    color: ${props => props.theme.colors.text.primary};
    font-family: inherit;
    font-size: ${props => props.theme.typography.fontSize.sm};
    transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};

    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.brand[500]};
      box-shadow: 0 0 0 2px ${props => props.theme.colors.brand[100]};
    }
    
    &::placeholder {
      color: ${props => props.theme.colors.text.tertiary};
    }
  }
`;

// Legacy export for backward compatibility during migration
export const messageInputStyles = {
  inputSection: InputSection,
  messageInput: MessageInput,
  inputForm: InputForm,
};

export default messageInputStyles;
