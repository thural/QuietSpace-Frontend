import styled from 'styled-components';
import { EnhancedTheme } from '@/core/theme';

// Enterprise styled-components for clickable elements
export const ClickableContainer = styled.div<{
  theme: EnhancedTheme;
  fontSize?: string;
  fontWeight?: string;
  padding?: string;
  height?: string
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${props => props.fontSize || 'inherit'};
  font-weight: ${props => props.fontWeight || 'inherit'};
  padding: ${props => props.padding || props.theme.spacing.sm};
  height: ${props => props.height || `calc(${props.theme.spacing.md} * 2)`};
  cursor: pointer;
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    background: ${props => props.theme.colors.background.tertiary};
    border-radius: ${props => props.theme.radius.sm};
    box-sizing: border-box;
  }
  
  &:active {
    background: ${props => props.theme.colors.background.secondary};
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.brand[300]};
    outline-offset: 2px;
  }
  
  & a, a:hover, a:focus, a:active {
    color: inherit;
    text-decoration: none;
  }
  
  & p {
    margin: 0;
    padding: 0;
    line-height: 0;
    align-self: center;
  }
`;
