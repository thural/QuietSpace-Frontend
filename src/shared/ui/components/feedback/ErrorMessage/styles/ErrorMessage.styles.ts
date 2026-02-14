/**
 * ErrorMessage Component Styles
 */

import { css } from '@emotion/react';

/**
 * Base error message container styles
 */
export const errorMessageContainerStyles = css`
  padding: 1rem;
  border: 1px solid #dc3545;
  border-radius: 4px;
  background-color: #f8d7da;
  color: #721c24;
  margin-bottom: 1rem;

  .error-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .error-title {
    font-weight: 600;
    font-size: 0.875rem;
  }

  .error-actions {
    display: flex;
    gap: 0.5rem;
  }

  .error-button {
    padding: 0.25rem 0.5rem;
    border: 1px solid #721c24;
    border-radius: 2px;
    background-color: transparent;
    color: #721c24;
    cursor: pointer;
    font-size: 0.75rem;

    &:hover {
      background-color: #721c24;
      color: white;
    }
  }

  .error-content {
    font-size: 0.875rem;
    line-height: 1.4;
  }

  .error-details {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid #f5c6cb;
    font-size: 0.75rem;
    color: #856404;
  }

  &.compact {
    padding: 0.5rem;
    font-size: 0.8rem;
  }

  &.detailed {
    padding: 1.5rem;
    border-width: 2px;
  }
`;
