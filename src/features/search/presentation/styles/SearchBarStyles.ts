/**
 * Search Bar Component Styles - Enterprise Styled-Components
 * 
 * Migrated from JSS to styled-components while maintaining
 * the same styling behavior and theme integration.
 */

import styled from 'styled-components';
import { Theme } from '@/app/theme';

export const SearchBar = styled.div<{ theme: Theme }>`
  display: flex;
  margin: ${props => `${props.theme.spacing(props.theme.spacingFactor.md)} 0`};
  position: relative;
  min-width: 320px;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.theme.colors?.borderExtra || '#bbbbbb'};
  border-radius: ${props => props.theme.radius.xl};
  background-color: ${props => props.theme.colors?.background || '#fafafa'};
`;

export const SearchBarSecondary = styled.div<{ theme: Theme }>`
  display: flex;
  margin: ${props => `${props.theme.spacing(props.theme.spacingFactor.md)} 0`};
  position: relative;
  min-width: 320px;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.theme.colors?.borderExtra || '#bbbbbb'};
  border-radius: ${props => props.theme.radius.md};
  background-color: ${props => props.theme.colors?.background || '#fafafa'};
`;

export const SearchInput = styled.input<{ theme: Theme }>`
  outline: 0;
  width: 100%;
  min-width: 360px;
  font-size: ${props => props.theme.typography.fontSize.primary};
  padding: ${props => `${props.theme.spacing(props.theme.spacingFactor.sm)} 0`};
  border: none;
  background: transparent;
`;

export const SearchIcon = styled.span<{ theme: Theme }>`
  margin: ${props => `0 ${props.theme.spacing(props.theme.spacingFactor.md)}`};
  font-size: ${props => props.theme.typography.fontSize.large};
  color: ${props => props.theme.colors?.borderExtra || '#bbbbbb'};
`;

export const SearchIconLarge = styled.span<{ theme: Theme }>`
  font-size: 2rem;
  margin: ${props => `0 ${props.theme.spacing(props.theme.spacingFactor.md)}`};
  color: ${props => props.theme.colors?.borderExtra || '#bbbbbb'};
`;

export const MicrophoneIcon = styled.span<{ theme: Theme }>`
  font-size: 1.5rem;
  margin: ${props => `0 ${props.theme.spacing(props.theme.spacingFactor.md)}`};
  color: ${props => props.theme.colors?.borderExtra || '#bbbbbb'};
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.colors?.primary || '#ff6f61'};
  }
`;

// Legacy export for backward compatibility during migration
export const SearchBarStyles = {
    searchbar: SearchBar,
    searchbarSecondary: SearchBarSecondary,
    searchInput: SearchInput,
    searchIcon: SearchIcon,
    searchIconLarge: SearchIconLarge,
    microphoneIcon: MicrophoneIcon,
};
