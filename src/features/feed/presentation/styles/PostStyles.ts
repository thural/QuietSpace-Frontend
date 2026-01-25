/**
 * Post Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and theme integration.
 */

import styled from 'styled-components';
import { Theme } from '@/app/theme';

export const PostCard = styled.div<{ theme: Theme }>`
  padding: 0;
  position: relative;
  font-size: ${props => props.theme.typography.fontSize.primary};
  margin: ${props => `${props.theme.spacing(props.theme.spacingFactor.md)} 0`};

  .badge {
    position: absolute;
    left: ${props => props.theme.spacing(props.theme.spacingFactor.md * 0.85)};
    bottom: ${props => props.theme.spacing(props.theme.spacingFactor.md * 1.15)};
    min-width: ${props => props.theme.spacing(props.theme.spacingFactor.md * 0.8)};
    max-height: ${props => props.theme.spacing(props.theme.spacingFactor.md * 0.8)};
  }

  hr {
    border: none;
    height: 0.1px;
    background-color: ${props => props.theme.colors?.hrDivider || '#cccccc'};
    margin-top: ${props => props.theme.spacing(props.theme.spacingFactor.md)};
  }

  &:not(:last-child) {
    border-bottom: 0.1px solid ${props => props.theme.colors?.hrDivider || '#cccccc'};
  }
`;

// Legacy export for backward compatibility during migration
export const PostStyles = {
    postCard: PostCard,
};
