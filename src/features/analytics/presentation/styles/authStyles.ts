import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const AuthContainer = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  background: ${props => props.theme.colors.background.primary};
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: inherit;

  & .greeting-text {
    display: flex;
    padding: ${props => props.theme.spacing.xl};
    flex-direction: column;
    flex-wrap: nowrap;
    min-width: min-content;
    align-items: flex-start;
    justify-content: flex-start;
    font-size: 3.2rem;
    align-self: center;
    gap: ${props => props.theme.spacing.xl};
    height: 360px;
    text-wrap: nowrap;
  }

  & .brand {
    margin-top: 0;
    min-width: max-content;
    margin-bottom: auto;
    font-family: inherit;
    color: ${props => props.theme.colors.text.primary};
    font-weight: ${props => props.theme.typography.fontWeight.bold};
  }

  & .primary-text {
    color: ${props => props.theme.colors.text.primary};
  }

  & .secondary-text {
    font-size: 1.2rem;
    font-weight: ${props => props.theme.typography.fontWeight.light};
    color: ${props => props.theme.colors.text.secondary};
  }

  @media (max-width: 720px) {
    flex-direction: column;
    justify-content: space-around;

    & .greeting-text {
      align-items: center;
      height: fit-content;
    }

    & .brand {
      font-size: 2.5rem;
      margin-bottom: ${props => props.theme.spacing.md};
    }

    & .secondary-text {
      display: none;
    }
  }
`;

// Legacy export for backward compatibility
const styles = () => ({
  auth: '',
});

export default styles;
