import styled from 'styled-components';
import { EnhancedTheme } from '../../core/theme';

export const CustomButton = styled.button<{ theme: EnhancedTheme }>`
  color: ${props => props.theme.colors.text.inverse};
  margin-left: auto;
  width: fit-content;
  border: 1px solid ${props => props.theme.colors.border.medium};
  padding: 6px 12px;
  font-size: ${props => props.theme.typography.fontSize.base};
  margin-top: ${props => props.theme.spacing.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  border-radius: ${props => props.theme.radius.md};
  background-color: ${props => props.theme.colors.brand[500]};
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
  
  &:active {
    transform: translateY(0);
  }
`;

// Legacy export for backward compatibility during migration
const styles = () => ({
  wrapper: '',
});

export default styles;
