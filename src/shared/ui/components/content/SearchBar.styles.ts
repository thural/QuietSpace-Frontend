/**
 * SearchBar Component Styles - Enterprise Styled-Components
 * 
 * Migrated from search feature implementations to provide
 * consistent styling across the application.
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/modules/theming';

export const SearchBarContainer = styled.div<{ theme: EnhancedTheme }>`
  display: flex;
  margin: ${(props: any) => `${props.theme.spacing.md} 0`};
  position: relative;
  min-width: 320px;
  align-items: center;
  justify-content: center;
  border: 1px solid ${(props: any) => props.theme.colors.border.light};
  border-radius: ${(props: any) => props.theme.radius.xl};
  background-color: ${(props: any) => props.theme.colors.background.primary};
  transition: all ${(props: any) => props.theme.animation.duration.fast} ${(props: any) => props.theme.animation.easing.ease};
  
  &:hover {
    border-color: ${(props: any) => props.theme.colors.border.medium};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:focus-within {
    border-color: ${(props: any) => props.theme.colors.brand[500]};
    box-shadow: 0 0 0 3px ${(props: any) => props.theme.colors.brand[100]};
  }

  .search-bar__icon {
    margin: ${(props: any) => `0 ${props.theme.spacing.md}`};
    font-size: ${(props: any) => props.theme.typography.fontSize.lg};
    color: ${(props: any) => props.theme.colors.text.secondary};
    transition: color ${(props: any) => props.theme.animation.duration.fast} ${(props: any) => props.theme.animation.easing.ease};
  }

  .search-bar__input {
    outline: 0;
    width: 100%;
    min-width: 360px;
    font-size: ${(props: any) => props.theme.typography.fontSize.base};
    padding: ${(props: any) => `${props.theme.spacing.sm} 0`};
    border: none;
    background: transparent;
    color: ${(props: any) => props.theme.colors.text.primary};
    
    &::placeholder {
      color: ${(props: any) => props.theme.colors.text.secondary};
    }
    
    &:focus {
      outline: none;
    }
  }

  .search-bar__clear {
    background: none;
    border: none;
    cursor: pointer;
    color: ${(props: any) => props.theme.colors.text.secondary};
    font-size: ${(props: any) => props.theme.typography.fontSize.sm};
    padding: ${(props: any) => props.theme.spacing.xs};
    border-radius: ${(props: any) => props.theme.radius.sm};
    margin-right: ${(props: any) => props.theme.spacing.sm};
    transition: all 0.2s ease;

    &:hover {
      color: ${(props: any) => props.theme.colors.danger};
      background-color: ${(props: any) => props.theme.colors.background.secondary};
    }
  }

  .search-bar__microphone {
    font-size: 1.5rem;
    margin: ${(props: any) => `0 ${props.theme.spacing.md}`};
    color: ${(props: any) => props.theme.colors.text.secondary};
    cursor: pointer;
    transition: all ${(props: any) => props.theme.animation.duration.fast} ${(props: any) => props.theme.animation.easing.ease};
    background: none;
    border: none;
    padding: ${(props: any) => props.theme.spacing.xs};

    &:hover {
    color: ${(props: any) => props.theme.colors.brand[500]};
    transform: scale(1.1);
  }
    
    &:active {
    transform: scale(0.95);
  }

    &.listening {
    color: ${(props: any) => props.theme.colors.danger};
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0 % {
      transform: scale(1);
    }
    50 % {
      transform: scale(1.1);
    }
    100 % {
      transform: scale(1);
    }
  }
}
`;

export const SearchBarSecondary = styled.div<{ theme: EnhancedTheme }>`
display: flex;
margin: ${(props: any) => `${props.theme.spacing.md} 0`};
position: relative;
min - width: 320px;
align - items: center;
justify - content: center;
border: 1px solid ${(props: any) => props.theme.colors.border.light};
border - radius: ${(props: any) => props.theme.radius.md};
background - color: ${(props: any) => props.theme.colors.background.primary};
transition: all ${(props: any) => props.theme.animation.duration.fast} ${(props: any) => props.theme.animation.easing.ease};
  
  &:hover {
  border - color: ${(props: any) => props.theme.colors.border.medium};
  box - shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
  
  &: focus - within {
  border - color: ${(props: any) => props.theme.colors.brand[500]};
  box - shadow: 0 0 0 3px ${(props: any) => props.theme.colors.brand[100]};
}
`;

export const SearchInput = styled.input<{ theme: EnhancedTheme }>`
outline: 0;
width: 100 %;
min - width: 360px;
font - size: ${(props: any) => props.theme.typography.fontSize.base};
padding: ${(props: any) => `${props.theme.spacing.sm} 0`};
border: none;
background: transparent;
color: ${(props: any) => props.theme.colors.text.primary};
  
  &::placeholder {
  color: ${(props: any) => props.theme.colors.text.secondary};
}
  
  &:focus {
  outline: none;
}
`;

export const SearchIcon = styled.span<{ theme: EnhancedTheme }>`
margin: ${(props: any) => `0 ${props.theme.spacing.md}`};
font - size: ${(props: any) => props.theme.typography.fontSize.lg};
color: ${(props: any) => props.theme.colors.text.secondary};
transition: color ${(props: any) => props.theme.animation.duration.fast} ${(props: any) => props.theme.animation.easing.ease);
`;

export const SearchIconLarge = styled.span<{ theme: EnhancedTheme }>`
font - size: 2rem;
margin: ${ (props: any) => `0 ${props.theme.spacing.md}` };
color: ${ (props: any) => props.theme.colors.text.secondary };
transition: color ${ (props: any) => props.theme.animation.duration.fast } ${
  (props: any) => props.theme.animation.easing.ease);
  `;

export const MicrophoneIcon = styled.span<{ theme: EnhancedTheme }>`
  font - size: 1.5rem;
  margin: ${ (props: any) => `0 ${props.theme.spacing.md}` };
  color: ${ (props: any) => props.theme.colors.text.secondary };
  cursor: pointer;
  transition: all ${ (props: any) => props.theme.animation.duration.fast } ${
    (props: any) => props.theme.animation.easing.ease);

  &:hover {
      color: ${ (props: any) => props.theme.colors.brand[500] };
      transform: scale(1.1);
    }
  
  &:active {
      transform: scale(0.95);
    }
    `;

// Legacy export for backward compatibility
export const SearchBarStyles = {
  container: SearchBarContainer,
  secondary: SearchBarSecondary,
  input: SearchInput,
  icon: SearchIcon,
  iconLarge: SearchIconLarge,
  microphone: MicrophoneIcon,
};

export default SearchBarStyles;
