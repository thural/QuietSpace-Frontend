/**
 * User Card Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and enhanced theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const QueryCard = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.radius.sm};
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.background.secondary};
  }
`;

export const DetailsSection = styled.div<{ theme: EnhancedTheme }>`
  margin: 0 ${props => props.theme.spacing.xs};
  flex: 1;
  
  & .user-name {
    font-size: ${props => props.theme.typography.fontSize.base};
    font-weight: ${props => props.theme.typography.fontWeight.medium};
    color: ${props => props.theme.colors.text.primary};
    margin: 0;
  }
  
  & .user-status {
    font-size: ${props => props.theme.typography.fontSize.sm};
    color: ${props => props.theme.colors.text.secondary};
    margin: 0;
  }
`;

// Legacy export for backward compatibility during migration
export const userCardStyles = {
    queryCard: QueryCard,
    detailsSection: DetailsSection,
};

export default userCardStyles;