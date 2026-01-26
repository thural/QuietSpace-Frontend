/**
 * Chat Card Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and enhanced theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const ChatCard = styled.div<{ theme: EnhancedTheme; isSelected?: boolean }>`
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  justify-items: flex-start;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  background-color: ${props => props.isSelected ? props.theme.colors.background.secondary : props.theme.colors.background.transparent};
  border-radius: ${props => props.theme.radius.md} 0 0 ${props => props.theme.radius.md};
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    background-color: ${props => props.theme.colors.background.secondary};
  }
`;

export const ChatCardAlt = styled.div<{ theme: EnhancedTheme }>`
  padding-left: 0;
  border-radius: ${props => props.theme.radius.md} 0 0 ${props => props.theme.radius.md};
  margin-left: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.xs} 0;
  background-color: ${props => props.theme.colors.background.transparent};
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    background-color: ${props => props.theme.colors.background.secondary};
  }
`;

export const ChatDetails = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
  
  & p {
    line-height: ${props => props.theme.typography.lineHeight.tight};
    font-weight: inherit;
    color: ${props => props.theme.colors.text.secondary};
    margin: 0;
  }
`;

// Legacy export for backward compatibility during migration
export const chatCardStyles = {
  chatCard: ChatCard,
  chatCardAlt: ChatCardAlt,
  chatDetails: ChatDetails,
};

export default chatCardStyles;