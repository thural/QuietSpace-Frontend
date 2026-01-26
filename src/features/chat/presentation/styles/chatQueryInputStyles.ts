/**
 * Chat Query Input Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and enhanced theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const ChatQuery = styled.div<{ theme: EnhancedTheme }>`
  width: 100%;
  margin: auto;
  display: flex;
  align-items: center;
  height: fit-content;
  flex-flow: row nowrap;
  box-sizing: border-box;
  color: ${props => props.theme.colors.text.primary};
  background-color: transparent;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.radius.md};
  border: 1px solid ${props => props.theme.colors.border};
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  
  &:focus-within {
    border-color: ${props => props.theme.colors.brand[500]};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.brand[100]};
  }
  
  &:hover {
    border-color: ${props => props.theme.colors.brand[300]};
  }
`;

// Legacy export for backward compatibility during migration
export const chatQueryInputStyles = {
    chatQuery: ChatQuery,
};

export default chatQueryInputStyles;