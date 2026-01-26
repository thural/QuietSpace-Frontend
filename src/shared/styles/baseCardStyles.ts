import styled from 'styled-components';
import { EnhancedTheme } from '../../core/theme';

export const BaseCard = styled.div<{ theme: EnhancedTheme }>`
  align-items: center;
  background: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.radius.lg};
  transition: all ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    background: ${props => props.theme.colors.background.tertiary};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

// Legacy export for backward compatibility during migration
const useStyles = () => ({
    baseCard: '',
});

export default useStyles;