import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const ActivationContainer = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text.primary};
  padding: ${props => props.theme.spacing.md};
  margin: ${props => props.theme.spacing.xl};
  min-width: 256px;
  box-shadow: ${props => props.theme.shadows.md};
  border-radius: ${props => props.theme.radius.lg};
  background-color: ${props => props.theme.colors.background.primary};

  & .button-custom {
    color: ${props => props.theme.colors.background.primary};
    margin-left: auto;
    width: fit-content;
    border: 1px solid ${props => props.theme.colors.border.light};
    padding: 6px 12px;
    font-size: ${props => props.theme.typography.fontSize.base};
    margin-top: ${props => props.theme.spacing.md};
    font-weight: ${props => props.theme.typography.fontWeight.medium};
    border-radius: ${props => props.theme.radius.full};
    background-color: ${props => props.theme.colors.text.primary};
    transition: ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};

    &:hover {
      background-color: ${props => props.theme.colors.brand[600]};
      border-color: ${props => props.theme.colors.brand[600]};
      transform: translateY(-1px);
    }
  }

  & .button {
    font-size: medium;
  }

  & form {
    gap: ${props => props.theme.spacing.md};
    display: flex;
    flex-direction: column;
    margin: ${props => props.theme.spacing.md} 0;
  }

  & .input {
    display: flex;
    flex-direction: column;
    gap: ${props => props.theme.spacing.sm};
  }

  & input {
    box-sizing: border-box;
    width: 100%;
    padding: 10px;
    height: 2rem;
    background-color: ${props => props.theme.colors.neutral[200]};
    border: 1px solid ${props => props.theme.colors.neutral[200]};
    border-radius: 10px;
    transition: ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};

    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.neutral[400]};
      box-shadow: 0 0 0 2px ${props => props.theme.colors.brand[200]};
    }
  }

  & h1 {
    margin-top: 0;
    color: ${props => props.theme.colors.text.primary};
  }

  & h3 {
    margin-bottom: 0;
    color: ${props => props.theme.colors.text.secondary};
  }

  & .resend-prompt {
    font-weight: ${props => props.theme.typography.fontWeight.medium};
    font-size: 1.1rem;
    color: ${props => props.theme.colors.text.primary};
  }

  @media (max-width: 630px) {
    margin: ${props => props.theme.spacing.md};
    min-width: auto;
  }
`;

// Legacy export for backward compatibility
const styles = () => ({
  activation: '',
});

export default styles;
