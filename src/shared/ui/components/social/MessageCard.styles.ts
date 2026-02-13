/**
 * MessageCard Component Styles - Enterprise Styled-Components
 * 
 * Migrated from chat feature implementations to provide
 * consistent styling across the application.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/modules/theming';

export const MessageCardContainer = styled.div<{ theme: EnhancedTheme; isOwn?: boolean; isDeleting?: boolean }>`
  max-width: 200px;
  position: relative;
  display: flex;
  cursor: pointer;
  flex-flow: column nowrap;
  justify-items: center;
  box-shadow: 0px 0px 16px -16px;
  border-radius: ${(props: any) => props.theme.radius.md};
  background-color: ${(props: any) => props.isOwn 
    ? props.theme.colors.brand[500] 
    : props.theme.colors.backgroundTransparentMax
  };
  border: 1px solid ${(props: any) => props.theme.colors.borderExtra};
  padding: ${(props: any) => props.theme.spacing(props.theme.spacingFactor.md * 0.8)};
  margin: ${(props: any) => props.theme.spacing(props.theme.spacingFactor.md * 0.3)} 0;
  color: ${(props: any) => props.isOwn 
    ? props.theme.colors.text.primary 
    : props.theme.colors.text
  };
  transition: all 0.2s ease;
  opacity: ${(props: any) => props.isDeleting ? 0.5 : 1};

  &:hover {
    border-color: ${(props: any) => props.theme.colors.border.base};
    box-shadow: ${(props: any) => props.theme.shadows.sm};
  }

  &.own {
    align-self: flex-end;
    margin-left: auto;
  }

  &.other {
    align-self: flex-start;
    margin-right: auto;
  }

  &.deleting {
    animation: fadeOut 0.3s ease-out forwards;
  }

  @keyframes fadeOut {
    to {
      opacity: 0;
      transform: scale(0.8);
    }
  }

  .message-wrapper {
    display: flex;
    flex-direction: column;
    gap: ${(props: any) => props.theme.spacing.xs};
  }

  .delete-button {
    position: absolute;
    width: 100%;
    right: 2.5rem;
    cursor: pointer;
    color: ${(props: any) => props.theme.colors.text};
    font-size: ${(props: any) => props.theme.typography.fontSize.small};
    font-weight: ${(props: any) => props.theme.typography.fontWeightThin};
    margin-bottom: ${(props: any) => props.theme.spacing(props.theme.spacingFactor.md * 0.2)};
    background: none;
    border: none;
    padding: ${(props: any) => props.theme.spacing.xs};
    border-radius: ${(props: any) => props.theme.radius.sm};
    transition: all 0.2s ease;

    &:hover {
      background-color: ${(props: any) => props.theme.colors.background.secondary};
      color: ${(props: any) => props.theme.colors.danger};
    }
  }
`;

export const MessageSender = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  gap: ${(props: any) => props.theme.spacing.sm};
  margin-bottom: ${(props: any) => props.theme.spacing.xs};

  .sender-avatar {
    width: ${(props: any) => props.theme.spacing.sm};
    height: ${(props: any) => props.theme.spacing.sm};
    border-radius: ${(props: any) => props.theme.radius.full};
    object-fit: cover;
  }

  .sender-name {
    font-size: ${(props: any) => props.theme.typography.fontSize.sm};
    font-weight: ${(props: any) => props.theme.typography.fontWeight.medium};
    color: ${(props: any) => props.theme.colors.text.secondary};
  }
`;

export const MessageContent = styled.div<{ theme: EnhancedTheme }>`
  .message-text {
    margin: 0;
    padding: 0;
    font-size: 0.9rem;
    font-weight: 400;
    line-height: ${(props: any) => props.theme.typography.lineHeight.normal};
    word-wrap: break-word;

    p {
      margin: 0;
      padding: 0;
    }
  }
`;

export const MessageMetadata = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${(props: any) => props.theme.spacing.xs};
  margin-top: ${(props: any) => props.theme.spacing.xs};

  .message-timestamp {
    font-size: ${(props: any) => props.theme.typography.fontSize.xs};
    color: ${(props: any) => props.theme.colors.text.secondary};
    opacity: 0.8;
  }

  .message-status {
    font-size: ${(props: any) => props.theme.typography.fontSize.xs};
    color: ${(props: any) => props.theme.colors.text.secondary};
    opacity: 0.8;
  }
`;

// Legacy export for backward compatibility
export const MessageCardStyles = {
  container: MessageCardContainer,
  sender: MessageSender,
  content: MessageContent,
  metadata: MessageMetadata,
};

export default MessageCardStyles;
