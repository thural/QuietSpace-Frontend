/**
 * Auth Component Styles (Alternative) - Enterprise Styled-Components
 * 
 * Modernized from JSS to styled-components with EnhancedTheme
 * and direct token access for consistent theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const AuthContainer = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  flex-flow: row nowrap;
  background: ${props => props.theme.colors.background.primary};
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: inherit;
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};

  .greeting-text {
    display: flex;
    padding: ${props => props.theme.spacing.xl};
    flex-flow: column nowrap;
    min-width: min-content;
    align-items: flex-start;
    justify-content: flex-start;
    font-size: 3.2rem;
    align-self: center;
    gap: ${props => props.theme.spacing.xl};
    height: 360px;
    text-wrap: nowrap;
    color: ${props => props.theme.colors.text.primary};
  }

  .brand {
    margin-top: 0;
    min-width: max-content;
    margin-bottom: auto;
    font-family: inherit;
    color: ${props => props.theme.colors.brand[500]};
    font-weight: bold;
  }

  .primary-text {
    color: ${props => props.theme.colors.text.primary};
    font-weight: 400;
  }

  .secondary-text {
    font-size: 1.2rem;
    font-weight: 300;
    color: ${props => props.theme.colors.text.secondary};
  }

  @media (max-width: 720px) {
    background: ${props => props.theme.colors.background.primary};
    flex-direction: column;
    justify-content: space-around;

    .greeting-text {
      align-items: center;
      height: fit-content;
    }

    .brand {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .secondary-text {
      display: none;
    }
  }
`;

export const FormContainer = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.lg};
  min-width: 400px;
  gap: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.radius.lg};
  background-color: ${props => props.theme.colors.background.secondary};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

export const ActivationContainer = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.lg};
  min-width: 400px;
  gap: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.radius.lg};
  background-color: ${props => props.theme.colors.background.secondary};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

// Modern export for backward compatibility during migration
export const AuthStylesAlt = {
  auth: AuthContainer,
  form: FormContainer,
  activation: ActivationContainer,
};

export default AuthStylesAlt;
