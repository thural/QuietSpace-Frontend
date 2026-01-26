/**
 * Message List Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and enhanced theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const Messages = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  padding: 0 4%;
  grid-row: 1/2;
  overflow: auto;
  flex-direction: column-reverse;
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
  
  /* Smooth scrolling behavior */
  scroll-behavior: smooth;
  
  /* Hide scrollbar when not hovering */
  scrollbar-width: thin;
  scrollbar-color: ${props => props.theme.colors.border} ${props => props.theme.colors.background.secondary};
`;

// Legacy export for backward compatibility during migration
export const messageListStyles = {
  messages: Messages,
};

export default messageListStyles;
