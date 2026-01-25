/**
 * Connection Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and theme integration.
 */

import styled from 'styled-components';
import { Theme } from '@/app/theme';

export const Container = styled.div<{ theme: Theme }>`
  padding-top: ${props => props.theme.spacing(props.theme.spacingFactor.ms * 2.5)};
  top: 50%;
  left: 50%;
  color: ${props => props.theme.colors.text};
  height: 50vh;
  margin: auto;
  display: block;
  position: fixed;
  flex-flow: row nowrap;
  transform: translate(-50%, -50%);
  z-index: ${props => props.theme.zIndex.modal};
  border-radius: ${props => props.theme.radius.md};
  background-color: ${props => props.theme.colors.background};
  gap: ${props => props.theme.spacing(props.theme.spacingFactor.sm)};
  border: 1px solid ${props => props.theme.colors.borderExtra};
  padding: ${props => props.theme.spacing(props.theme.spacingFactor.md)};
`;

// Legacy export for backward compatibility during migration
export const connectionStyles = {
    container: Container,
};
