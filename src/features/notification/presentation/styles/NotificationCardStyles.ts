/**
 * Notification Card Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and theme integration.
 */

import styled from 'styled-components';
import { Theme } from '@/app/theme';

export const NotificationCard = styled.div<{ theme: Theme }>`
  display: flex;
  align-items: center;
  width: 100%;
  border-bottom: 0.1rem solid ${props => props.theme.colors?.hrDivider || '#cccccc'};
  padding: ${props => `${props.theme.spacing(props.theme.spacingFactor.sm)} 0`};

  button {
    height: 2rem;
    width: 8rem;
    cursor: pointer;
    display: block;
    margin-left: auto;
    color: ${props => props.theme.colors?.textMax || '#ffffff'};
    border: 1px solid ${props => props.theme.colors?.buttonBorder || '#888888'};
    padding: ${props => `0 ${props.theme.spacing(props.theme.spacingFactor.md)}`};
    font-size: ${props => props.theme.spacing(0.9)};
    font-weight: ${props => props.theme.typography.fontWeightBold};
    border-radius: ${props => props.theme.radius.ms};
    background-color: ${props => props.theme.colors?.backgroundSecondary || '#e9ecef'};
  }
`;

// Legacy export for backward compatibility during migration
export const NotificationCardStyles = {
    notificationCard: NotificationCard,
};
