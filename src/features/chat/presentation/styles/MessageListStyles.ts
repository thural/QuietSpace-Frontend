/**
 * Message List Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and theme integration.
 */

import styled from 'styled-components';
import { Theme } from '@/app/theme';

export const Messages = styled.div<{ theme: Theme }>`
  display: flex;
  padding: 0 4%;
  grid-row: 1/2;
  overflow: auto;
  flex-direction: column-reverse;
`;

// Legacy export for backward compatibility during migration
export const messageListStyles = {
    messages: Messages,
};
