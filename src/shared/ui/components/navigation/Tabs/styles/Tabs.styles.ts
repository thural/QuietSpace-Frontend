/**
 * Tabs Component Styles
 * 
 * Enterprise-grade Emotion CSS styles for the Tabs component
 * with theme integration, animations, and responsive design.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { css } from '@emotion/react';
import { 
  getSpacing, 
  getColor, 
  getBorderWidth, 
  getTransition,
  getBreakpoint,
  getTypography
} from '../../../utils';

/**
 * Base container styles for the tabs component
 */
export const tabsContainerStyles = () => css`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

/**
 * Styles for the tabs list container
 */
export const tabsListStyles = (
  theme?: any,
  justify: 'center' | 'start' | 'end' = 'start',
  grow: boolean = false
) => css`
  display: flex;
  justify-content: ${justify === 'center' ? 'center' : 
                   justify === 'end' ? 'flex-end' : 'flex-start'};
  ${grow && 'flex: 1;'}
  border-bottom: ${getBorderWidth(theme, 'sm')} solid ${getColor(theme, 'border.light')};
  margin-bottom: ${getSpacing(theme, 'md')};
`;

/**
 * Styles for individual tab buttons
 */
export const tabButtonStyles = (
  theme?: any,
  active: boolean = false,
  color: string = 'brand.500'
) => css`
  background: none;
  border: none;
  padding: ${getSpacing(theme, 'sm')} ${getSpacing(theme, 'lg')};
  cursor: pointer;
  font-size: ${getTypography(theme, 'fontSize.base')};
  font-family: ${getTypography(theme, 'fontFamily.primary')};
  font-weight: ${getTypography(theme, 'fontWeight.medium')};
  color: ${active ? 
        getColor(theme, color) : 
        getColor(theme, 'text.secondary')};
  border-bottom: ${getBorderWidth(theme, 'md')} solid ${active ?
        getColor(theme, color) :
        'transparent'};
  transition: ${getTransition(theme, 'all', 'fast', 'ease')};
  display: flex;
  align-items: center;
  gap: ${getSpacing(theme, 'sm')};
  position: relative;
  white-space: nowrap;
  user-select: none;

  &:hover:not(:disabled) {
    color: ${getColor(theme, color)};
    background-color: ${getColor(theme, 'background.secondary')};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 ${getSpacing(theme, '2')} ${getColor(theme, 'brand.200')};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    color: ${getColor(theme, 'text.disabled')};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: ${getBorderWidth(theme, 'md')};
    background: ${getColor(theme, color)};
    transform: ${active ? 'scaleX(1)' : 'scaleX(0)'};
    transition: ${getTransition(theme, 'transform', 'fast', 'ease')};
  }
`;

/**
 * Styles for tab panel content
 */
export const tabPanelStyles = (
  theme?: any,
  active: boolean = false
) => css`
  display: ${active ? 'block' : 'none'};
  width: 100%;
  opacity: ${active ? '1' : '0'};
  transition: ${getTransition(theme, 'opacity', 'fast', 'ease')};
  
  ${active && css`
    animation: ${tabPanelFadeIn} ${getTransition(theme, 'duration', 'fast')}ms ${getTransition(theme, 'easing', 'ease')};
  `}
`;

/**
 * Keyframe animation for tab panel fade-in effect
 */
const tabPanelFadeIn = css`
  @keyframes tabPanelFadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

/**
 * Responsive styles for mobile devices
 */
export const tabsResponsiveStyles = (theme?: any) => css`
  @media (max-width: ${getBreakpoint(theme, 'sm')}) {
    ${tabsListStyles(theme, 'start', false)} {
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
      
      &::-webkit-scrollbar {
        display: none;
      }
    }
    
    ${tabButtonStyles(theme, false)} {
      padding: ${getSpacing(theme, 'sm')} ${getSpacing(theme, 'md')};
      font-size: ${getTypography(theme, 'fontSize.sm')};
      min-width: fit-content;
    }
  }
`;

/**
 * Styles for tab indicator (animated underline)
 */
export const tabIndicatorStyles = (
  theme?: any,
  color: string = 'brand.500',
  left: number = 0,
  width: number = 0
) => css`
  position: absolute;
  bottom: 0;
  left: ${left}px;
  width: ${width}px;
  height: ${getBorderWidth(theme, 'md')};
  background: ${getColor(theme, color)};
  transition: ${getTransition(theme, ['left', 'width'], 'fast', 'ease')};
  pointer-events: none;
`;

/**
 * Styles for vertical tabs layout
 */
export const tabsVerticalStyles = (theme?: any) => css`
  display: flex;
  flex-direction: row;
  height: 100%;
  
  .tabs-list-vertical {
    flex-direction: column;
    border-bottom: none;
    border-right: ${getBorderWidth(theme, 'sm')} solid ${getColor(theme, 'border.light')};
    margin-bottom: 0;
    margin-right: ${getSpacing(theme, 'md')};
    min-width: 200px;
  }
  
  .tab-button-vertical {
    border-bottom: none;
    border-right: ${getBorderWidth(theme, 'md')} solid transparent;
    justify-content: flex-start;
    padding: ${getSpacing(theme, 'md')} ${getSpacing(theme, 'lg')};
    
    &.active {
      border-right-color: ${getColor(theme, 'brand.500')};
    }
  }
  
  .tabs-panels-vertical {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`;

/**
 * Styles for compact tabs variant
 */
export const tabsCompactStyles = (theme?: any) => css`
  ${tabButtonStyles(theme, false)} {
    padding: ${getSpacing(theme, 'xs')} ${getSpacing(theme, 'sm')};
    font-size: ${getTypography(theme, 'fontSize.sm')};
  }
  
  ${tabsListStyles(theme, 'start', false)} {
    margin-bottom: ${getSpacing(theme, 'sm')};
  }
`;

/**
 * Styles for pills tabs variant
 */
export const tabsPillsStyles = (theme?: any, color: string = 'brand.500') => css`
  ${tabsListStyles(theme, 'start', false)} {
    border-bottom: none;
    gap: ${getSpacing(theme, 'sm')};
    padding: ${getSpacing(theme, 'xs')};
    background-color: ${getColor(theme, 'background.tertiary')};
    border-radius: ${getSpacing(theme, 'border.radius.lg')};
  }
  
  ${tabButtonStyles(theme, false, color)} {
    border-bottom: none;
    border-radius: ${getSpacing(theme, 'border.radius.md')};
    padding: ${getSpacing(theme, 'sm')} ${getSpacing(theme, 'md')};
    
    &.active {
      background-color: ${getColor(theme, color)};
      color: ${getColor(theme, 'text.inverse')};
      
      &:hover {
        background-color: ${getColor(theme, color)};
        opacity: 0.9;
      }
    }
    
    &:hover:not(.active) {
      background-color: transparent;
    }
  }
`;
