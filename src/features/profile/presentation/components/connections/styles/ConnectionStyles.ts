/**
 * Connection Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '@core/modules/theming';

export const Container = styled.div<{ theme: EnhancedTheme }>`
  padding-top: ${props => props.theme.spacing.lg};
  top: 50%;
  left: 50%;
  color: ${props => props.theme.colors.text.primary};
  height: 50vh;
  margin: auto;
  display: block;
  position: fixed;
  flex-flow: row nowrap;
  transform: translate(-50%, -50%);
  z-index: 1000; /* TODO: Use theme.zIndex.modal when available in EnhancedTheme */
  border-radius: ${props => props.theme.radius.md};
  background-color: ${props => props.theme.colors.background.primary};
  gap: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border.light};
  padding: ${props => props.theme.spacing.md};
`;

// Legacy export for backward compatibility during migration
export const connectionStyles = {
  container: Container,
};
