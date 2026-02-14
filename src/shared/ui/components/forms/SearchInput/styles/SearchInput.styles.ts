/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { getSpacing, getColor, getBorderWidth, getRadius, getTransition, getTypography, getBreakpoint } from '../../utils';

/**
 * SearchInput container styles
 */
export const SearchInputContainer = (theme: any) => css`
  position: relative;
  width: 100%;
`;

/**
 * SearchInput input styles
 */
export const SearchInputField = (theme: any) => css`
  width: 100%;
  padding: ${getSpacing(theme, 'md')};
  font-size: ${getTypography(theme, 'fontSize.base')};
  font-family: ${theme?.typography?.fontFamily?.sans?.join(', ') || 'system-ui, sans-serif'};
  color: ${getColor(theme, 'text.primary')};
  background: ${getColor(theme, 'background.primary')};
  border: ${getBorderWidth(theme, 'sm')} solid ${getColor(theme, 'border.medium')};
  border-radius: ${getRadius(theme, 'md')};
  transition: ${getTransition(theme, 'all', 'normal', 'ease')};
  
  &::placeholder {
    color: ${getColor(theme, 'text.tertiary')};
  }
  
  &:focus {
    outline: none;
    border-color: ${getColor(theme, 'brand.500')};
    box-shadow: 0 0 0 ${getSpacing(theme, 3)} solid ${getColor(theme, 'brand.200')};
  }
  
  &:hover:not(:focus) {
    border-color: ${getColor(theme, 'border.dark')};
  }
  
  &:disabled {
    background: ${getColor(theme, 'background.tertiary')};
    color: ${getColor(theme, 'text.tertiary')};
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  // Responsive design
  @media (max-width: ${getBreakpoint(theme, 'sm')}) {
    padding: ${getSpacing(theme, 'sm')};
    font-size: ${getTypography(theme, 'fontSize.sm')};
  }
`;

/**
 * Suggestions dropdown styles
 */
export const SuggestionsDropdown = (theme: any) => css`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${getColor(theme, 'background.primary')};
  border: ${getBorderWidth(theme, 'sm')} solid ${getColor(theme, 'border.medium')};
  border-radius: ${getRadius(theme, 'md')};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
`;

/**
 * Individual suggestion item styles
 */
export const SuggestionItem = (theme: any, isSelected: boolean = false) => css`
  padding: ${getSpacing(theme, 'sm')} ${getSpacing(theme, 'md')};
  cursor: pointer;
  border-bottom: ${getBorderWidth(theme, 'xs')} solid ${getColor(theme, 'border.light')};
  transition: ${getTransition(theme, 'background', 'fast', 'ease')};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover, ${isSelected && css`
    background: ${getColor(theme, 'background.secondary')};
  `}
`;

/**
 * Loading spinner container styles
 */
export const LoadingContainer = (theme: any) => css`
  position: absolute;
  right: ${getSpacing(theme, 'md')};
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
`;
