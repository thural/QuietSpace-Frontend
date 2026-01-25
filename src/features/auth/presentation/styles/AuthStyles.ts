/**
 * Auth Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and theme integration.
 */

import styled from 'styled-components';
import { Theme } from '@/app/theme';

export const AuthContainer = styled.div<{ theme: Theme }>`
  display: flex;
  flex-flow: row nowrap;
  background: ${props => props.theme.colors?.background || '#fafafa'};
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: inherit;

  .greeting-text {
    display: flex;
    padding: ${props => props.theme.spacing(props.theme.spacingFactor.md * 2)};
    flex-flow: column nowrap;
    min-width: min-content;
    align-items: flex-start;
    justify-content: flex-start;
    font-size: 3.2rem;
    align-self: center;
    gap: ${props => props.theme.spacing(props.theme.spacingFactor.md * 3)};
    height: 360px;
    text-wrap: nowrap;
  }

  .brand {
    margin-top: 0;
    min-width: max-content;
    margin-bottom: auto;
    font-family: inherit;
  }

  .primary-text {
    /* Styles can be added as needed */
  }

  .secondary-text {
    font-size: 1.2rem;
    font-weight: 300;
  }

  @media (max-width: 720px) {
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

export const FormContainer = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing(props.theme.spacingFactor.lg)};
  min-width: 400px;
  gap: ${props => props.theme.spacing(props.theme.spacingFactor.md)};
`;

export const ActivationContainer = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing(props.theme.spacingFactor.lg)};
  min-width: 400px;
  gap: ${props => props.theme.spacing(props.theme.spacingFactor.md)};
`;

// Legacy export for backward compatibility during migration
export const AuthStyles = {
    auth: AuthContainer,
    form: FormContainer,
    activation: ActivationContainer,
};
