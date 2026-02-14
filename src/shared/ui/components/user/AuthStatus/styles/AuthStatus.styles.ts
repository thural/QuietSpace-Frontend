/**
 * Auth Status Component Styles
 */

import { css } from '@emotion/react';

/**
 * Base auth status container styles
 */
export const authStatusContainer = css`
  border-radius: 0.5rem;
  border-width: 1px;
`;

/**
 * Unauthenticated state styles
 */
export const unauthenticatedStyles = css`
  ${authStatusContainer};
  background-color: #f9fafb;
  border-color: #e5e7eb;
  color: #4b5563;
`;

/**
 * Authenticated state styles
 */
export const authenticatedStyles = css`
  ${authStatusContainer};
  background-color: #f0fdf4;
  border-color: #bbf7d0;
`;

/**
 * Variant spacing styles
 */
export const variantSpacing = {
  default: css`
    padding: 1rem;
  `,
  compact: css`
    padding: 0.75rem;
  `,
  detailed: css`
    padding: 1.5rem;
  `
};

/**
 * Header container styles
 */
export const headerContainer = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

/**
 * User info container styles
 */
export const userInfoContainer = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

/**
 * Avatar container styles
 */
export const avatarContainer = css`
  flex-shrink: 0;
`;

/**
 * Avatar image styles
 */
export const avatarImage = css`
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 9999px;
  object-fit: cover;
`;

/**
 * Avatar placeholder styles
 */
export const avatarPlaceholder = css`
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 9999px;
  background-color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
`;

/**
 * User name styles
 */
export const userName = css`
  font-weight: 500;
  color: #065f46;
`;

/**
 * User email/username styles
 */
export const userEmail = css`
  font-size: 0.875rem;
  color: #059669;
`;

/**
 * User ID styles
 */
export const userId = css`
  font-size: 0.75rem;
  color: #047857;
  margin-top: 0.25rem;
`;

/**
 * Toggle button styles
 */
export const toggleButton = css`
  color: #059669;
  cursor: pointer;
  
  &:hover {
    color: #047857;
  }
  
  &:focus {
    outline: none;
  }
`;

/**
 * Expanded details container styles
 */
export const expandedDetails = css`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
`;

/**
 * Detail row styles
 */
export const detailRow = css`
  display: flex;
  justify-content: space-between;
`;

/**
 * Detail label styles
 */
export const detailLabel = css`
  color: #4b5563;
`;

/**
 * Detail value styles
 */
export const detailValue = css`
  font-weight: 500;
`;

/**
 * Status badge styles
 */
export const statusBadge = css`
  padding: 0.25rem 0.5rem;
  background-color: #dcfce7;
  color: #166534;
  border-radius: 0.25rem;
  font-size: 0.75rem;
`;

/**
 * Timestamp styles
 */
export const timestamp = css`
  font-size: 0.75rem;
  color: #6b7280;
`;

/**
 * Success indicator styles
 */
export const successIndicator = css`
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  color: #059669;
  gap: 0.25rem;
`;

/**
 * Success text styles
 */
export const successText = css`
  font-size: 0.875rem;
  font-weight: 500;
`;
