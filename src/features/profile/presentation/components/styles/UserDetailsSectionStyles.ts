/**
 * User Details Section Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and theme integration.
 */

import styled from 'styled-components';
import { Theme } from '@/app/theme';

export const Container = styled.div<{ theme: Theme }>`
  padding: ${props => props.theme.spacing(props.theme.spacingFactor.md)};
`;

export const Header = styled.div<{ theme: Theme }>`
  display: flex;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing(props.theme.spacingFactor.sm)};
`;

export const Title = styled.h2<{ theme: Theme }>`
  font-size: ${props => props.theme.typography.fontSize.xLarge};
  font-weight: bold;
  margin: 0;
`;

export const Content = styled.div<{ theme: Theme }>`
  margin-top: ${props => props.theme.spacing(props.theme.spacingFactor.sm)};
`;

// Legacy export for backward compatibility during migration
export const userDetailsSectionStyles = {
    container: Container,
    header: Header,
    title: Title,
    content: Content,
};
