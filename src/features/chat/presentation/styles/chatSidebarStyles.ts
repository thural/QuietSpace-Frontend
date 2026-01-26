/**
 * Chat Sidebar Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and enhanced theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const ChatContainer = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  width: 24rem;
  flex-flow: column nowrap;
  border-right: 1px solid ${props => props.theme.colors.border};
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  background-color: ${props => props.theme.colors.background.primary};
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background.secondary};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.radius.full};
    
    &:hover {
      background: ${props => props.theme.colors.brand[400]};
    }
  }
`;

// Legacy export for backward compatibility during migration
export const chatSidebarStyles = {
    chatContainer: ChatContainer,
};

export default chatSidebarStyles;
