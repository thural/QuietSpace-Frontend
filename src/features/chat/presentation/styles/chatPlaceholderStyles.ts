/**
 * Chat Placeholder Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and enhanced theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const ChatBoard = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  overflow: hidden;
  flex-flow: column nowrap;
  width: 100%;
  background-color: ${props => props.theme.colors.background.primary};
  align-items: center;
  justify-content: center;
  min-height: 200px;
  
  & .add-post-btn {
    margin-top: ${props => props.theme.spacing.md};
    width: fit-content;
    background-color: ${props => props.theme.colors.brand[600]};
    color: ${props => props.theme.colors.text.inverse};
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
    border-radius: ${props => props.theme.radius.full};
    border: 1px solid ${props => props.theme.colors.brand[600]};
    font-size: ${props => props.theme.typography.fontSize.base};
    font-weight: ${props => props.theme.typography.fontWeight.medium};
    margin-bottom: ${props => props.theme.spacing.md};
    cursor: pointer;
    transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
    
    &:hover {
      background-color: ${props => props.theme.colors.brand[700]};
      border-color: ${props => props.theme.colors.brand[700]};
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
  
  & .system-message {
    margin-top: 100%;
    color: ${props => props.theme.colors.text.secondary};
    font-size: ${props => props.theme.typography.fontSize.sm};
    text-align: center;
    padding: ${props => props.theme.spacing.md};
  }
  
  & .placeholder-text {
    color: ${props => props.theme.colors.text.tertiary};
    font-size: ${props => props.theme.typography.fontSize.base};
    text-align: center;
    margin-bottom: ${props => props.theme.spacing.lg};
  }
`;

// Legacy export for backward compatibility during migration
export const chatPlaceholderStyles = {
    chatboard: ChatBoard,
};

export default chatPlaceholderStyles;