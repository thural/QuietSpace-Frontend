/**
 * Comment Component Styles - Modern Theme Integration
 * 
 * Enterprise styled-components with modern centralized theme system.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const CommentWrapper = styled.div<{ theme: EnhancedTheme; isReply?: boolean }>`
  display: flex;
  margin-left: ${(props: any) => props.isReply ? 'auto' : '0'};
  font-size: ${(props: any) => props.theme.typography.fontSize.sm};
  gap: ${(props: any) => props.theme.spacing.md};

  @media (max-width: ${(props: any) => props.theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${(props: any) => props.theme.spacing.sm};
  }
`;

export const CommentAvatar = styled.div<{ theme: EnhancedTheme }>`
  width: ${(props: any) => props.theme.spacing.xl};
  height: ${(props: any) => props.theme.spacing.xl};
  border-radius: ${(props: any) => props.theme.radius.full};
  background-color: ${(props: any) => props.theme.colors.brand[500]};
  color: ${(props: any) => props.theme.colors.text.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props: any) => props.theme.typography.fontSize.lg};
  font-weight: ${(props: any) => props.theme.typography.fontWeight.bold};
  flex-shrink: 0;
`;

export const CommentContent = styled.div<{ theme: EnhancedTheme }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${(props: any) => props.theme.spacing.xs};
`;

export const CommentHeader = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  gap: ${(props: any) => props.theme.spacing.sm};
  margin-bottom: ${(props: any) => props.theme.spacing.xs};
`;

export const CommentAuthor = styled.span<{ theme: EnhancedTheme }>`
  font-size: ${(props: any) => props.theme.typography.fontSize.sm};
  font-weight: ${(props: any) => props.theme.typography.fontWeight.bold};
  color: ${(props: any) => props.theme.colors.text.primary};
`;

export const CommentTimestamp = styled.span<{ theme: EnhancedTheme }>`
  font-size: ${(props: any) => props.theme.typography.fontSize.sm};
  color: ${(props: any) => props.theme.colors.text.secondary};
  margin-left: ${(props: any) => props.theme.spacing.xs};
`;

export const CommentText = styled.p<{ theme: EnhancedTheme }>`
  font-size: ${(props: any) => props.theme.typography.fontSize.sm};
  color: ${(props: any) => props.theme.colors.text.primary};
  line-height: ${(props: any) => props.theme.typography.lineHeight.normal};
  margin: 0;
  word-wrap: break-word;

  @media (max-width: ${(props: any) => props.theme.breakpoints.sm}) {
    font-size: ${(props: any) => props.theme.typography.fontSize.sm};
  }
`;

export const CommentActions = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  gap: ${(props: any) => props.theme.spacing.sm};
  margin-top: ${(props: any) => props.theme.spacing.sm};

  @media (max-width: ${(props: any) => props.theme.breakpoints.sm}) {
    justify-content: space-between;
  }
`;

export const CommentAction = styled.button<{ theme: EnhancedTheme }>`
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props: any) => props.theme.colors.text.secondary};
  font-size: ${(props: any) => props.theme.typography.fontSize.sm};
  padding: ${(props: any) => props.theme.spacing.xs};
  border-radius: ${(props: any) => props.theme.radius.sm};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${(props: any) => props.theme.spacing.xs};

  &:hover {
    color: ${(props: any) => props.theme.colors.brand[500]};
    background-color: ${(props: any) => props.theme.colors.background.secondary};
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const CommentReplyCard = styled.div<{ theme: EnhancedTheme }>`
  background-color: ${(props: any) => props.theme.colors.background.secondary};
  border-radius: ${(props: any) => props.theme.radius.md};
  padding: ${(props: any) => props.theme.spacing.md};
  margin-top: ${(props: any) => props.theme.spacing.sm};
  border: 1px solid ${(props: any) => props.theme.colors.border.light};

  @media (max-width: ${(props: any) => props.theme.breakpoints.sm}) {
    margin-left: ${(props: any) => props.theme.spacing.md};
  }
`;

// Legacy export for backward compatibility during migration
export const CommentStyles = {
  wrapper: CommentWrapper,
  avatar: CommentAvatar,
  content: CommentContent,
  header: CommentHeader,
  author: CommentAuthor,
  timestamp: CommentTimestamp,
  text: CommentText,
  actions: CommentActions,
  action: CommentAction,
  replyCard: CommentReplyCard,
};

export default CommentStyles;
