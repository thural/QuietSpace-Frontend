/**
 * Chat Query Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and enhanced theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const SearchContainer = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${props => props.theme.colors.background.primary};
`;

export const Contacts = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  grid-column: 1/2;
  position: relative;
  border-right: 1px solid ${props => props.theme.colors.border};
  flex-flow: column nowrap;
  background-color: ${props => props.theme.colors.background.primary};
`;

export const SearchSection = styled.div<{ theme: EnhancedTheme }>`
  z-index: 1000;
  position: relative;
`;

export const ResultContainer = styled.div<{ theme: EnhancedTheme }>`
  width: 100%;
  display: none;
  min-height: 16rem;
  position: absolute;
  box-sizing: border-box;
  flex-direction: column;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background-color: ${props => props.theme.colors.background.primary};
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.xs};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.md};
  
  &.visible {
    display: flex;
  }
`;

export const RecentQueries = styled.div<{ theme: EnhancedTheme }>`
  width: 100%;
  align-items: center;
  box-sizing: border-box;
  justify-content: space-between;
  padding: 0 ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

export const QueryCard = styled.div<{ theme: EnhancedTheme }>`
  width: 100%;
  display: flex;
  align-items: center;
  padding: ${props => props.theme.spacing.sm} 0;
  border-radius: ${props => props.theme.radius.sm};
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.background.secondary};
  }
`;

// Legacy export for backward compatibility during migration
export const chatQueryStyles = {
    searchContainer: SearchContainer,
    contacts: Contacts,
    searchSection: SearchSection,
    resultContainer: ResultContainer,
    recentQueries: RecentQueries,
    queryCard: QueryCard,
};

export default chatQueryStyles;
