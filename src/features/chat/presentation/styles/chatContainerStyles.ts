/**
 * Chat Container Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and enhanced theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const Container = styled.div<{ theme: EnhancedTheme }>`
  height: 100%;
  display: flex;
  padding-top: ${props => props.theme.spacing.xl};
`;

export const Contacts = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  flex-flow: column nowrap;
  border-right: 1px solid ${props => props.theme.colors.border};
  grid-column: 1/2;
  background-color: ${props => props.theme.colors.background.primary};
`;

export const Messages = styled.div<{ theme: EnhancedTheme }>`
  padding: 0 ${props => props.theme.spacing.xl};
  width: 100%;
  flex-basis: min-content;
  flex-grow: 1;
  background-color: ${props => props.theme.colors.background.primary};
  
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
`;

// Legacy export for backward compatibility during migration
export const chatContainerStyles = {
  container: Container,
  contacts: Contacts,
  messages: Messages,
};

export default chatContainerStyles;
