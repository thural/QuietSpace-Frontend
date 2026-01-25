/**
 * Query Result Component Styles - Enterprise Styled-Components
 * 
 * Modernized from JSS to styled-components with EnhancedTheme
 * and direct token access for consistent theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const ResultContainer = styled.div<{ theme: EnhancedTheme; isVisible?: boolean }>`
  width: 100%;
  height: 50vh;
  display: ${props => props.isVisible ? 'block' : 'none'};
  box-sizing: border-box;
  z-index: 1000;
  border-radius: ${props => props.theme.radius.md};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background-color: ${props => props.theme.colors.background.primary};
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  overflow-y: auto;
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background.secondary};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border.medium};
    border-radius: 3px;
    
    &:hover {
      background: ${props => props.theme.colors.border.dark};
    }
  }
`;

// Modern export for backward compatibility during migration
export const QueryResultStyles = {
    resultContainer: ResultContainer,
};

export default QueryResultStyles;