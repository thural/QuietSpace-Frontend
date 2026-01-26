/**
 * Message Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and enhanced theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const Message = styled.div<{ theme: EnhancedTheme }>`
  max-width: 200px;
  position: relative;
  display: flex;
  cursor: pointer;
  flex-flow: column nowrap;
  justify-items: center;
  box-shadow: 0px 0px 16px -16px rgba(0, 0, 0, 0.1);
  border-radius: ${props => props.theme.radius.md};
  background-color: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.md} ${props => props.theme.spacing.md} calc(${props => props.theme.spacing.md} * 0.8);
  margin: calc(${props => props.theme.spacing.md} * 0.3) 0;
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    box-shadow: 0px 4px 20px -16px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
  }
  
  & .buttons {
    display: flex;
    margin-left: auto;
    align-items: center;
    flex-flow: row nowrap;
    gap: ${props => props.theme.spacing.xs};
  }
  
  & button {
    color: ${props => props.theme.colors.text.primary};
    background-color: ${props => props.theme.colors.background.secondary};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.radius.md};
    padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
    cursor: pointer;
    transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
    
    &:hover {
      background-color: ${props => props.theme.colors.background.tertiary};
      border-color: ${props => props.theme.colors.brand[400]};
    }
  }
`;

export const Delete = styled.div<{ theme: EnhancedTheme }>`
  width: 100%;
  right: 2.5rem;
  cursor: pointer;
  position: absolute;
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.light};
  margin-bottom: calc(${props => props.theme.spacing.md} * 0.2);
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    color: #dc2626;
  }
`;

export const Text = styled.div<{ theme: EnhancedTheme }>`
  margin: 0;
  padding: 0;
  font-size: 0.9rem;
  font-weight: ${props => props.theme.typography.fontWeight.normal};
  line-height: ${props => props.theme.typography.lineHeight.normal};
  color: ${props => props.theme.colors.text.primary};
  
  & p {
    margin: 0;
    padding: 0;
  }
`;

// Legacy export for backward compatibility during migration
export const messageStyles = {
  message: Message,
  delete: Delete,
  text: Text,
};

export default messageStyles;
