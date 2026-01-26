import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const FormContainer = styled.div<{ theme: EnhancedTheme }>`
  gap: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text.primary};
  display: flex;
  padding: ${props => props.theme.spacing.md};
  margin: ${props => props.theme.spacing.xl};
  flex-direction: column;
  flex-wrap: nowrap;
  min-width: 256px;
  box-shadow: ${props => props.theme.shadows.md};
  border-radius: ${props => props.theme.radius.md};
  background-color: ${props => props.theme.colors.background.primary};
  transition: ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};

  &:hover {
    box-shadow: ${props => props.theme.shadows.lg};
  }

  & .prompt {
    font-weight: ${props => props.theme.typography.fontWeight.normal};
    font-size: 1.1rem;
    color: ${props => props.theme.colors.text.primary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.border.medium};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.brand[200]};
  }

  @media (max-width: 630px) {
    margin: ${props => props.theme.spacing.md};
    min-width: auto;
  }
`;

// Legacy export for backward compatibility
const styles = () => ({
  form: '',
});

export default styles;
