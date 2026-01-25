/**
 * Message Input Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and theme integration.
 */

import styled from 'styled-components';
import { Theme } from '@/app/theme';

export const InputSection = styled.div<{ theme: Theme }>`
  z-index: 1;
  margin-top: auto;
`;

export const MessageInput = styled.textarea<{ theme: Theme }>`
  width: 100%;
  border: none;
  height: auto;
  resize: none;
  outline: none;
  padding: 10px;
  overflow: hidden;
  box-sizing: border-box;
  max-height: 200px;
  border-radius: 4px;
  background-color: transparent;
`;

export const InputForm = styled.form<{ theme: Theme }>`
  gap: 1rem;
  color: black;
  width: 100%;
  height: 100%;
  margin: auto;
  display: flex;
  flex-flow: row nowrap;
  box-sizing: border-box;
  align-items: center;
  background-color: white;

  & button {
    color: white;
    width: fit-content;
    padding: 4px 8px;
    font-size: 1rem;
    font-weight: 500;
    display: flex;
  }

  & .input {
    display: flex;
    flex-flow: column nowrap;
    gap: 0.5rem;
  }

  & input {
    box-sizing: border-box;
    width: 100%;
    padding: 10px;
    height: 1.8rem;
    background-color: #e2e8f0;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
  }

  & input:focus {
    outline: none;
    border-color: #a7abb1;
  }
`;

// Legacy export for backward compatibility during migration
export const messageInputStyles = {
    inputSection: InputSection,
    messageInput: MessageInput,
    inputForm: InputForm,
};
