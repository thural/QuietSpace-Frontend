import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const NotificationCard = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  width: 100%;
  border-bottom: 0.1rem solid ${props => props.theme.colors.border.light};
  padding: ${props => props.theme.spacing.sm} 0;
  transition: ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};

  &:hover {
    background-color: ${props => props.theme.colors.background.secondary};
  }

  & button {
    height: 2rem;
    width: 8rem;
    cursor: pointer;
    display: block;
    margin-left: auto;
    color: ${props => props.theme.colors.text.primary};
    border: 1px solid ${props => props.theme.colors.border.medium};
    padding: 0 ${props => props.theme.spacing.md};
    font-size: 0.9rem;
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    border-radius: ${props => props.theme.radius.sm};
    background-color: ${props => props.theme.colors.background.secondary};
    transition: ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};

    &:hover {
      background-color: ${props => props.theme.colors.brand[100]};
      border-color: ${props => props.theme.colors.brand[300]};
      transform: translateY(-1px);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px ${props => props.theme.colors.brand[200]};
    }

    &:active {
      transform: translateY(0);
    }
  }

  @media (max-width: 630px) {
    padding: ${props => props.theme.spacing.xs} 0;

    & button {
      width: 6rem;
      font-size: 0.8rem;
      padding: 0 ${props => props.theme.spacing.sm};
    }
  }
`;

// Legacy export for backward compatibility during migration
export const NotificationCardStyles = {
    notificationCard: NotificationCard,
};

// Legacy JSS export for backward compatibility
const styles = () => ({
    notificationCard: '',
});

export default styles;