import styled from 'styled-components';
import { EnhancedTheme } from '../../../core/theme';

export const ChatPageContainer = styled.div<{ theme: EnhancedTheme }>`
  height: 100%;
  display: flex;
  padding-top: 4rem;
  background-color: ${props => props.theme.colors.background.primary};
`;

export const ChatContacts = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${props => props.theme.colors.border.medium};
  grid-column: 1/2;
  background-color: ${props => props.theme.colors.background.secondary};
`;

export const ChatMessages = styled.div<{ theme: EnhancedTheme }>`
  padding: 0 10%;
  width: 100%;
  flex-basis: min-content;
  flex-grow: 1;
  background-color: ${props => props.theme.colors.background.primary};
  
  & .add-post-btn {
    margin-top: ${props => props.theme.spacing.md};
    width: fit-content;
    background-color: ${props => props.theme.colors.brand[500]};
    color: ${props => props.theme.colors.text.inverse};
    padding: 4px 8px;
    border-radius: ${props => props.theme.radius.full};
    border: 1px solid ${props => props.theme.colors.brand[500]};
    font-size: ${props => props.theme.typography.fontSize.base};
    font-weight: ${props => props.theme.typography.fontWeight.medium};
    margin-bottom: ${props => props.theme.spacing.md};
    cursor: pointer;
    transition: all ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};
    
    &:hover {
      background-color: ${props => props.theme.colors.brand[600]};
      border-color: ${props => props.theme.colors.brand[600]};
      transform: translateY(-2px);
      box-shadow: ${props => props.theme.shadows.md};
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px ${props => props.theme.colors.brand[200]};
    }
  }
`;

// Legacy export for backward compatibility during migration
const styles = () => ({
  container: '',
  contacts: '',
  messages: '',
});

export default styles;
