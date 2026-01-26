import styled from 'styled-components';
import { EnhancedTheme } from '../../core/theme';

export const Input = styled.input<{ theme: EnhancedTheme }>`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.radius.sm};
  background-color: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.base};
  transition: all ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.brand[500]};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.brand[200]};
  }
  
  &:hover {
    border-color: ${props => props.theme.colors.border.dark};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.text.secondary};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.background.tertiary};
    color: ${props => props.theme.colors.text.disabled};
    cursor: not-allowed;
  }
`;

export const TextArea = styled.textarea<{ theme: EnhancedTheme }>`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border.medium};
  border-radius: ${props => props.theme.radius.sm};
  background-color: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: all ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.brand[500]};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.brand[200]};
  }
  
  &:hover {
    border-color: ${props => props.theme.colors.border.dark};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.text.secondary};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.background.tertiary};
    color: ${props => props.theme.colors.text.disabled};
    cursor: not-allowed;
  }
`;

// Legacy export for backward compatibility during migration
const styles = () => ({
    input: '',
    textarea: '',
});

export default styles;