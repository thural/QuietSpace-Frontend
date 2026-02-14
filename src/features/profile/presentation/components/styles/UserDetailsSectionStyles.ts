/**
 * User Details Section Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and theme integration.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '@core/modules/theming';

export const Container = styled.div<{ theme: EnhancedTheme }>`
  padding: ${props => props.theme.spacing.md};
`;

export const Header = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

export const Title = styled.h2<{ theme: EnhancedTheme }>`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: bold;
  margin: 0;
`;

export const Content = styled.div<{ theme: EnhancedTheme }>`
  margin-top: ${props => props.theme.spacing.sm};
`;

// Legacy export for backward compatibility during migration
export const userDetailsSectionStyles = {
  container: Container,
  header: Header,
  title: Title,
  content: Content,
};
