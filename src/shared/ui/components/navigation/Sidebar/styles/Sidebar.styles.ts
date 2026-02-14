/**
 * Sidebar Component Styles
 * 
 * Enterprise-grade Emotion CSS styles for the Sidebar component
 * with theme integration, animations, and responsive design.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */

import { css } from '@emotion/react';
import { 
  getSpacing, 
  getColor, 
  getRadius, 
  getTransition,
  getTypography
} from '../../../utils';

/**
 * Base container styles for sidebar
 */
export const sidebarContainerStyles = (
  theme?: any,
  position: 'left' | 'right' = 'left',
  sidebarTheme: 'light' | 'dark' = 'light',
  size: 'small' | 'medium' | 'large' = 'medium',
  collapsed: boolean = false,
  fixed: boolean = true
) => css`
  display: flex;
  flex-direction: column;
  background-color: ${sidebarTheme === 'dark' ? 
    getColor(theme, 'background.inverse') : 
    getColor(theme, 'background.primary')};
  border-right: ${position === 'left' ? 
    `${getSpacing(theme, 'border.width.sm')} solid ${getColor(theme, 'border.light')}` : 
    'none'};
  border-left: ${position === 'right' ? 
    `${getSpacing(theme, 'border.width.sm')} solid ${getColor(theme, 'border.light')}` : 
    'none'};
  box-shadow: ${position === 'left' ? 
    `${getSpacing(theme, 'sm')} 0 ${getSpacing(theme, 'md')} ${getColor(theme, 'shadow.light')}` : 
    `-${getSpacing(theme, 'sm')} 0 ${getSpacing(theme, 'md')} ${getColor(theme, 'shadow.light')}`};
  transition: ${getTransition(theme, 'width', 'medium', 'ease')};
  z-index: ${fixed ? 1000 : 1};
  height: 100vh;
  overflow: hidden;
  ${fixed ? css`
    position: fixed;
    top: 0;
    ${position}: 0;
  ` : css`
    position: relative;
  `}
`;

/**
 * Sidebar logo styles
 */
export const sidebarLogoStyles = (
  theme?: any,
  collapsed: boolean = false
) => css`
  display: flex;
  align-items: center;
  padding: ${getSpacing(theme, 'md')};
  border-bottom: ${getSpacing(theme, 'border.width.sm')} solid ${getColor(theme, 'border.light')};
  min-height: 60px;
  text-decoration: none;
  color: ${getColor(theme, 'text.primary')};
  transition: ${getTransition(theme, 'all', 'fast', 'ease')};

  &:hover {
    background-color: ${getColor(theme, 'background.secondary')};
  }
`;

/**
 * Sidebar logo image styles
 */
export const sidebarLogoImageStyles = (theme?: any) => css`
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: ${getRadius(theme, 'sm')};
`;

/**
 * Sidebar logo text styles
 */
export const sidebarLogoTextStyles = (
  theme?: any,
  collapsed: boolean = false
) => css`
  margin-left: ${getSpacing(theme, 'sm')};
  font-size: ${getTypography(theme, 'fontSize.lg')};
  font-weight: ${getTypography(theme, 'fontWeight.semibold')};
  color: ${getColor(theme, 'text.primary')};
  opacity: ${collapsed ? 0 : 1};
  transition: ${getTransition(theme, 'opacity', 'fast', 'ease')};
`;

/**
 * Sidebar user info styles
 */
export const sidebarUserStyles = (
  theme?: any,
  collapsed: boolean = false
) => css`
  display: flex;
  align-items: center;
  padding: ${getSpacing(theme, 'md')};
  border-bottom: ${getSpacing(theme, 'border.width.sm')} solid ${getColor(theme, 'border.light')};
  text-decoration: none;
  color: ${getColor(theme, 'text.primary')};
  transition: ${getTransition(theme, 'all', 'fast', 'ease')};

  &:hover {
    background-color: ${getColor(theme, 'background.secondary')};
  }
`;

/**
 * Sidebar user avatar styles
 */
export const sidebarUserAvatarStyles = (theme?: any) => css`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: ${getRadius(theme, 'full')};
  margin-right: ${getSpacing(theme, 'sm')};
`;

/**
 * Sidebar user info text styles
 */
export const sidebarUserInfoStyles = (
  theme?: any,
  collapsed: boolean = false
) => css`
  opacity: ${collapsed ? 0 : 1};
  transition: ${getTransition(theme, 'opacity', 'fast', 'ease')};
`;

/**
 * Sidebar user name styles
 */
export const sidebarUserNameStyles = (theme?: any) => css`
  font-size: ${getTypography(theme, 'fontSize.base')};
  font-weight: ${getTypography(theme, 'fontWeight.semibold')};
  color: ${getColor(theme, 'text.primary')};
  line-height: 1.2;
`;

/**
 * Sidebar user email styles
 */
export const sidebarUserEmailStyles = (theme?: any) => css`
  font-size: ${getTypography(theme, 'fontSize.sm')};
  color: ${getColor(theme, 'text.secondary')};
  margin-top: ${getSpacing(theme, 'xs')};
`;

/**
 * Sidebar content styles
 */
export const sidebarContentStyles = (theme?: any) => css`
  flex: 1;
  overflow-y: auto;
  padding: ${getSpacing(theme, 'sm')} 0;
`;

/**
 * Sidebar section styles
 */
export const sidebarSectionStyles = (
  theme?: any,
  collapsed: boolean = false
) => css`
  margin-bottom: ${getSpacing(theme, 'sm')};
`;

/**
 * Sidebar section header styles
 */
export const sidebarSectionHeaderStyles = (
  theme?: any,
  collapsed: boolean = false,
  collapsible: boolean = true
) => css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${getSpacing(theme, 'md')};
  cursor: ${collapsible ? 'pointer' : 'default'};
  transition: ${getTransition(theme, 'all', 'fast', 'ease')};

  &:hover {
    background-color: ${getColor(theme, 'background.secondary')};
  }
`;

/**
 * Sidebar section title content styles
 */
export const sidebarSectionTitleContentStyles = (
  theme?: any,
  collapsed: boolean = false
) => css`
  display: flex;
  align-items: center;
  gap: ${getSpacing(theme, 'sm')};
  opacity: ${collapsed ? 0 : 1};
  transition: ${getTransition(theme, 'opacity', 'fast', 'ease')};
`;

/**
 * Sidebar section icon styles
 */
export const sidebarSectionIconStyles = (
  theme?: any,
  size: 'small' | 'medium' | 'large' = 'medium'
) => css`
  font-size: ${getSidebarIconSize(theme, size)};
  color: ${getColor(theme, 'text.secondary')};
`;

/**
 * Get sidebar icon size based on component size
 */
const getSidebarIconSize = (
  theme?: any,
  size: 'small' | 'medium' | 'large'
) => {
  const iconSizes = {
    small: getTypography(theme, 'fontSize.sm'),
    medium: getTypography(theme, 'fontSize.base'),
    large: getTypography(theme, 'fontSize.lg')
  };
  return iconSizes[size] || iconSizes.medium;
};

/**
 * Sidebar section title styles
 */
export const sidebarSectionTitleStyles = (
  theme?: any,
  collapsed: boolean = false
) => css`
  font-size: ${getTypography(theme, 'fontSize.base')};
  font-weight: ${getTypography(theme, 'fontWeight.medium')};
  color: ${getColor(theme, 'text.primary')};
  opacity: ${collapsed ? 0 : 1};
  transition: ${getTransition(theme, 'opacity', 'fast', 'ease')};
`;

/**
 * Sidebar section arrow styles
 */
export const sidebarSectionArrowStyles = (
  theme?: any,
  collapsed: boolean = false
) => css`
  font-size: ${getTypography(theme, 'fontSize.sm')};
  color: ${getColor(theme, 'text.tertiary')};
  transition: ${getTransition(theme, 'transform', 'fast', 'ease')};
  transform: ${collapsed ? 'rotate(-90deg)' : 'rotate(0deg)'};
`;

/**
 * Sidebar section content styles
 */
export const sidebarSectionContentStyles = (theme?: any) => css`
  background-color: ${getColor(theme, 'background.secondary')};
  border-left: ${getSpacing(theme, 'border.width.md')} solid ${getColor(theme, 'brand.500')};
  margin-left: ${getSpacing(theme, 'md')};
`;

/**
 * Sidebar footer styles
 */
export const sidebarFooterStyles = (
  theme?: any,
  collapsed: boolean = false
) => css`
  padding: ${getSpacing(theme, 'md')};
  border-top: ${getSpacing(theme, 'border.width.sm')} solid ${getColor(theme, 'border.light')};
  opacity: ${collapsed ? 0 : 1};
  transition: ${getTransition(theme, 'opacity', 'fast', 'ease')};
`;

/**
 * Sidebar toggle button styles
 */
export const sidebarToggleStyles = (
  theme?: any,
  position: 'left' | 'right' = 'left',
  collapsed: boolean = false
) => css`
  position: fixed;
  top: 50%;
  ${position}: ${collapsed ? 
    (position === 'left' ? '60px' : 'calc(100% - 60px)') : 
    (position === 'left' ? '280px' : 'calc(100% - 280px)')};
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background-color: ${getColor(theme, 'brand.500')};
  color: ${getColor(theme, 'text.inverse')};
  border: none;
  border-radius: ${getRadius(theme, 'full')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${getTypography(theme, 'fontSize.sm')};
  transition: ${getTransition(theme, 'all', 'fast', 'ease')};
  z-index: 1001;
  box-shadow: `0 ${getSpacing(theme, 'sm')} ${getSpacing(theme, 'md')} ${getColor(theme, 'shadow.medium')}`;

  &:hover {
    background-color: ${getColor(theme, 'brand.600')};
    transform: translateY(-50%) scale(1.1);
  }
`;

/**
 * Responsive styles for mobile devices
 */
export const sidebarResponsiveStyles = (theme?: any) => css`
  @media (max-width: ${getTypography(theme, 'breakpoints.md')}) {
    ${sidebarContainerStyles(theme, 'left', 'light', 'medium', false, true)} {
      width: 100%;
      transform: translateX(-100%);
    }
    
    ${sidebarContainerStyles(theme, 'left', 'light', 'medium', false, true)}[data-collapsed="false"] {
      transform: translateX(0);
    }
    
    ${sidebarToggleStyles(theme, 'left', false)} {
      display: none;
    }
  }
`;
