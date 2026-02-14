/**
 * UserCard Component Styles
 * 
 * Enterprise-grade Emotion CSS styles for the UserCard component
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
} from '../../utils';

/**
 * Base container styles for user card
 */
export const userCardContainerStyles = (
  theme?: any,
  isLoading: boolean = false
) => css`
  display: flex;
  flex-direction: column;
  background-color: ${getColor(theme, 'background.primary')};
  border: ${getSpacing(theme, 'border.width.sm')} solid ${getColor(theme, 'border.light')};
  border-radius: ${getRadius(theme, 'lg')};
  box-shadow: `0 ${getSpacing(theme, 'sm')} ${getSpacing(theme, 'lg')} ${getColor(theme, 'shadow.medium')}`;
  transition: ${getTransition(theme, 'all', 'fast', 'ease')};
  position: relative;
  overflow: hidden;
  opacity: ${isLoading ? '0.7' : '1'};
  cursor: ${isLoading ? 'not-allowed' : 'pointer'};
`;

/**
 * User card header styles
 */
export const userCardHeaderStyles = (
  theme?: any
) => css`
  display: flex;
  align-items: center;
  padding: ${getSpacing(theme, 'lg')};
  border-bottom: ${getSpacing(theme, 'border.width.sm')} solid ${getColor(theme, 'border.light')};
  background-color: ${getColor(theme, 'background.secondary')};
`;

/**
 * User card content styles
 */
export const userCardContentStyles = (
  theme?: any
) => css`
  display: flex;
  gap: ${getSpacing(theme, 'lg')};
  padding: ${getSpacing(theme, 'lg')};
`;

/**
 * User card avatar container styles
 */
export const userCardAvatarContainerStyles = (
  theme?: any
) => css`
  flex-shrink: 0;
`;

/**
 * User card details container styles
 */
export const userCardDetailsContainerStyles = (
  theme?: any
) => css`
  flex: 1;
  min-width: 0;
`;

/**
 * User card details section styles
 */
export const userCardDetailsStyles = (
  theme?: any
) => css`
  display: flex;
  flex-direction: column;
  gap: ${getSpacing(theme, 'sm')};
`;

/**
 * User card name styles
 */
export const userCardNameStyles = (
  theme?: any
) => css`
  font-size: ${getTypography(theme, 'fontSize.lg')};
  font-weight: ${getTypography(theme, 'fontWeight.semibold')};
  color: ${getColor(theme, 'text.primary')};
  line-height: 1.2;
`;

/**
 * User card email styles
 */
export const userCardEmailStyles = (
  theme?: any
) => css`
  font-size: ${getTypography(theme, 'fontSize.sm')};
  color: ${getColor(theme, 'text.secondary')};
  margin-top: ${getSpacing(theme, 'xs')};
`;

/**
 * User card role styles
 */
export const userCardRoleStyles = (
  theme?: any
) => css`
  font-size: ${getTypography(theme, 'fontSize.sm')};
  color: ${getColor(theme, 'text.tertiary')};
  background-color: ${getColor(theme, 'background.tertiary')};
  padding: ${getSpacing(theme, 'xs')} ${getSpacing(theme, 'sm')};
  border-radius: ${getRadius(theme, 'sm')};
  font-weight: ${getTypography(theme, 'fontWeight.medium')};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

/**
 * User card children section styles
 */
export const userCardChildrenStyles = (
  theme?: any
) => css`
  padding: ${getSpacing(theme, 'md')};
  background-color: ${getColor(theme, 'background.secondary')};
  border-top: ${getSpacing(theme, 'border.width.sm')} solid ${getColor(theme, 'border.light')};
`;

/**
 * Loading overlay styles for user card
 */
export const userCardLoadingOverlayStyles = (
  theme?: any
) => css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${getColor(theme, 'background.overlay')};
  border-radius: ${getRadius(theme, 'lg')};
  z-index: 1;
`;

/**
 * Loading spinner styles for user card
 */
export const userCardLoadingSpinnerStyles = (
  theme?: any
) => css`
  width: 24px;
  height: 24px;
  border: ${getSpacing(theme, 'border.width.md')} solid ${getColor(theme, 'border.light')};
  border-top: ${getSpacing(theme, 'border.width.md')} solid ${getColor(theme, 'brand.500')};
  border-radius: 50%;
  animation: userCardSpin 1s linear infinite;
`;

/**
 * Responsive styles for mobile devices
 */
export const userCardResponsiveStyles = (theme?: any) => css`
  @media (max-width: ${getTypography(theme, 'breakpoints.sm')}) {
    ${userCardContainerStyles(theme, false)} {
      margin: ${getSpacing(theme, 'sm')} 0;
    }
    
    ${userCardContentStyles(theme)} {
      flex-direction: column;
      gap: ${getSpacing(theme, 'md')};
    }
  }
`;

/**
 * Keyframes for loading animation
 */
export const userCardKeyframes = css`
  @keyframes userCardSpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
