/**
 * Chat Panel Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and theme integration.
 */

import styled from 'styled-components';
import { Theme } from '@/app/theme';

export const ChatBoard = styled.div<{ theme: Theme }>`
  display: flex;
  overflow: hidden;
  flex-flow: column nowrap;
  width: 100%;

  & .add-post-btn {
    margin-top: 1rem;
    width: fit-content;
    background-color: black;
    color: white;
    padding: 4px 8px;
    border-radius: 1rem;
    border: 1px solid black;
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }

  & .system-message {
    margin-top: 100%;
  }
`;

// Legacy export for backward compatibility during migration
export const chatPanelStyles = {
    chatboard: ChatBoard,
};
