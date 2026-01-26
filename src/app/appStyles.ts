import styled from 'styled-components';
import { EnhancedTheme } from '../core/theme';

export const AppContainer = styled.div<{ theme: EnhancedTheme }>`
  height: 100vh;
  background-color: ${props => props.theme.colors.background.primary};
  transition: background-color ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};
  
  /* Ensure proper theme switching */
  &[data-theme="dark"] {
    background-color: ${props => props.theme.colors.background.primary};
  }
  
  &[data-theme="light"] {
    background-color: ${props => props.theme.colors.background.primary};
  }
`;

// Legacy export for backward compatibility during migration
const styles = () => ({
	app: '',
});

export default styles;
