/**
 * Comment Panel Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and enhanced theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '@core/theme';

export const CommentSection = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  flex-flow: column nowrap;
  font-size: ${(props: any) => props.theme.typography.fontSize.base};
  margin-top: ${(props: any) => props.theme.spacing.sm};
  gap: ${(props: any) => props.theme.spacing.sm};

  /* React Input Emoji Styles */
  .react-input-emoji--container {
    font-size: ${(props: any) => props.theme.typography.fontSize.base};
    font-family: ${(props: any) => props.theme.typography.fontFamily.sans.join(', ')};
    padding: 0;
    margin: ${(props: any) => props.theme.spacing.sm};
    position: relative;
  }

  .react-input-emoji--button {
    display: flex;
    font: inherit;
    cursor: pointer;
    font-size: ${(props: any) => props.theme.typography.fontSize.base};
    margin-left: 0;
    border: 1px solid ${(props: any) => props.theme.colors.border.light};
    border-radius: ${(props: any) => props.theme.radius.md};
    background-color: ${(props: any) => props.theme.colors.background.primary};
    padding: ${(props: any) => props.theme.spacing.xs};
    transition: all 0.2s ease;

    &:hover {
      background-color: ${(props: any) => props.theme.colors.background.secondary};
      border-color: ${(props: any) => props.theme.colors.border.base};
    }

    &:active {
      transform: scale(0.95);
    }

    svg {
      color: ${(props: any) => props.theme.colors.text.secondary};
    }
  }

  .react-input-emoji--input {
    margin: 0;
    padding: 0;
    font-weight: ${(props: any) => props.theme.typography.fontWeight.light};
    max-height: 100px;
    min-height: 20px;
    outline: none;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    white-space: pre-wrap;
    word-wrap: break-word;
    z-index: 1;
    width: 100%;
    user-select: text;
    text-align: left;
    color: ${(props: any) => props.theme.colors.text.primary};
    background-color: transparent;
    border: none;
    resize: none;
    font-family: ${(props: any) => props.theme.typography.fontFamily.sans.join(', ')};
    line-height: ${(props: any) => props.theme.typography.lineHeight.normal};

    &::placeholder {
      color: ${(props: any) => props.theme.colors.text.secondary};
      opacity: 0.7;
    }

    &:focus {
      outline: 2px solid ${(props: any) => props.theme.colors.brand[500]};
      outline-offset: 2px;
      border-radius: ${(props: any) => props.theme.radius.xs};
    }
  }

  .react-input-emoji--placeholder {
    left: 0;
    z-index: 1;
    color: ${(props: any) => props.theme.colors.text.secondary};
    opacity: 0.7;
    position: absolute;
    pointer-events: none;
    top: 0;
    padding: ${(props: any) => props.theme.spacing.xs};
  }
`;

export const CommentInput = styled.textarea<{ theme: EnhancedTheme }>`
  width: 100%;
  border: none;
  height: auto;
  resize: none;
  outline: none;
  padding: ${(props: any) => props.theme.spacing.sm};
  overflow: hidden;
  box-sizing: border-box;
  max-height: 200px;
  border-radius: ${(props: any) => props.theme.radius.xs};
  background-color: transparent;
  font-size: ${(props: any) => props.theme.typography.fontSize.base};
  font-family: ${(props: any) => props.theme.typography.fontFamily.sans.join(', ')};
  color: ${(props: any) => props.theme.colors.text.primary};
  line-height: ${(props: any) => props.theme.typography.lineHeight.normal};
  transition: all 0.2s ease;

  &::placeholder {
    color: ${(props: any) => props.theme.colors.text.secondary};
    opacity: 0.7;
  }

  &:focus {
    outline: 2px solid ${(props: any) => props.theme.colors.brand[500]};
    outline-offset: 2px;
    background-color: ${(props: any) => props.theme.colors.background.secondary};
  }

  &:hover {
    background-color: ${(props: any) => props.theme.colors.background.secondary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${(props: any) => props.theme.colors.background.secondary};
  }
`;

export const CommentPanelContainer = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  flex-direction: column;
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
`;

export const CommentPanelHeader = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: ${(props: any) => props.theme.spacing.md};
  border-bottom: 1px solid ${(props: any) => props.theme.colors.border.light};

  h3 {
    font-size: ${(props: any) => props.theme.typography.fontSize.base};
    font-weight: ${(props: any) => props.theme.typography.fontWeight.bold};
    color: ${(props: any) => props.theme.colors.text.primary};
    margin: 0;
  }
`;

export const CommentPanelActions = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  gap: ${(props: any) => props.theme.spacing.sm};
  justify-content: flex-end;
  padding-top: ${(props: any) => props.theme.spacing.md};
  border-top: 1px solid ${(props: any) => props.theme.colors.border.light};

  @media (max-width: ${(props: any) => props.theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${(props: any) => props.theme.spacing.md};
  }
`;

export const EmojiPickerWrapper = styled.div<{ theme: EnhancedTheme; isOpen?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;

  .emoji-picker-container {
    position: absolute;
    bottom: 100%;
    left: 0;
    background-color: ${(props: any) => props.theme.colors.background.primary};
    border: 1px solid ${(props: any) => props.theme.colors.border.light};
    border-radius: ${(props: any) => props.theme.radius.md};
    box-shadow: ${(props: any) => props.theme.shadows.md};
    z-index: ${(props: any) => props.theme.zIndex.modal};
    opacity: ${(props: any) => props.isOpen ? 1 : 0};
    visibility: ${(props: any) => props.isOpen ? 'visible' : 'hidden'};
    transform: ${(props: any) => props.isOpen ? 'translateY(0)' : 'translateY(10px)'};
    transition: all 0.3s ease;
    margin-bottom: ${(props: any) => props.theme.spacing.xs};
    max-height: 300px;
    overflow-y: auto;
  }
`;

// Legacy export for backward compatibility during migration
export const CommentPanelStyles = {
  commentSection: CommentSection,
  commentInput: CommentInput,
  container: CommentPanelContainer,
  header: CommentPanelHeader,
  actions: CommentPanelActions,
  emojiPicker: EmojiPickerWrapper,
};

export default CommentPanelStyles;