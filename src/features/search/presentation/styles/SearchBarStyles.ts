/**
 * Search Bar Component Styles - Enterprise Styled-Components
 * 
 * Modernized with EnhancedTheme and direct token access for
 * consistent theme integration and improved performance.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/theme';

export const SearchBar = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  margin: ${props => `${props.theme.spacing.md} 0`};
  position: relative;
  min-width: 320px;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.radius.xl};
  background-color: ${props => props.theme.colors.background.primary};
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    border-color: ${props => props.theme.colors.border.medium};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:focus-within {
    border-color: ${props => props.theme.colors.brand[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.brand[100]};
  }
`;

export const SearchBarSecondary = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  margin: ${props => `${props.theme.spacing.md} 0`};
  position: relative;
  min-width: 320px;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.radius.md};
  background-color: ${props => props.theme.colors.background.primary};
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    border-color: ${props => props.theme.colors.border.medium};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:focus-within {
    border-color: ${props => props.theme.colors.brand[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.brand[100]};
  }
`;

export const SearchInput = styled.input<{ theme: EnhancedTheme }>`
  outline: 0;
  width: 100%;
  min-width: 360px;
  font-size: ${props => props.theme.typography.fontSize.base};
  padding: ${props => `${props.theme.spacing.sm} 0`};
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.text.primary};
  
  &::placeholder {
    color: ${props => props.theme.colors.text.secondary};
  }
  
  &:focus {
    outline: none;
  }
`;

export const SearchIcon = styled.span<{ theme: EnhancedTheme }>`
  margin: ${props => `0 ${props.theme.spacing.md}`};
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.text.secondary};
  transition: color ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
`;

export const SearchIconLarge = styled.span<{ theme: EnhancedTheme }>`
  font-size: 2rem;
  margin: ${props => `0 ${props.theme.spacing.md}`};
  color: ${props => props.theme.colors.text.secondary};
  transition: color ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
`;

export const MicrophoneIcon = styled.span<{ theme: EnhancedTheme }>`
  font-size: 1.5rem;
  margin: ${props => `0 ${props.theme.spacing.md}`};
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};

  &:hover {
    color: ${props => props.theme.colors.brand[500]};
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
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
