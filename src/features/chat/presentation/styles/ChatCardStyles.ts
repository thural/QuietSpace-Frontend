/**
 * Chat Card Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and theme integration.
 */

import styled from 'styled-components';
import { Theme } from '@/app/theme';

interface ChatCardProps {
    theme: Theme;
    isSelected?: boolean;
}

export const ChatCard = styled.div<ChatCardProps>`
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  justify-items: flex-start;
  gap: ${props => props.theme.spacing(props.theme.spacingFactor.sm)};
  padding: ${props => props.theme.spacing(props.theme.spacingFactor.sm)};
  background-color: ${props => props.isSelected
        ? props.theme.colors?.backgroundSecondary || '#e9ecef'
        : props.theme.colors?.backgroundTransparentMax || 'rgba(255, 255, 255, 0)'
    };
  border-radius: ${props => `${props.theme.radius.md} 0 0 ${props.theme.radius.md}`};
`;

export const ChatCardAlt = styled.div<{ theme: Theme }>`
  padding-left: 0;
  border-radius: ${props => `${props.theme.radius.md} 0 0 ${props.theme.radius.md}`};
  margin-left: ${props => props.theme.spacing(props.theme.spacingFactor.sm)};
  padding: ${props => `${props.theme.spacing(props.theme.spacingFactor.xs)} 0`};
  background-color: ${props => props.theme.colors?.backgroundTransparent || 'rgba(255, 255, 255, 0.85)'};
`;

export const ChatDetails = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing(props.theme.spacingFactor.xs)};

  p {
    line-height: 1rem;
    font-weight: inherit;
  }
`;

// Legacy export for backward compatibility during migration
export const ChatCardStyles = {
    chatCard: ChatCard,
    chatCardAlt: ChatCardAlt,
    chatDetails: ChatDetails,
};
