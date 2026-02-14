/**
 * SearchBar Component Styles
 */

import { css, keyframes } from '@emotion/react';

const pulseKeyframes = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const spinKeyframes = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

/**
 * Base search bar container styles
 */
export const searchBarContainerStyles = css`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 1rem;
    line-height: 1.5;
    transition: all 0.2s ease-in-out;
    outline: none;

    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    &:disabled {
      background-color: #f3f4f6;
      cursor: not-allowed;
    }

    &::placeholder {
      color: #9ca3af;
    }
  }

  .search-icon {
    position: absolute;
    left: 0.75rem;
    color: #6b7280;
    pointer-events: none;
  }

  .clear-button {
    position: absolute;
    right: 0.75rem;
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: all 0.2s ease-in-out;

    &:hover {
      background-color: #f3f4f6;
      color: #374151;
    }
  }

  .microphone-button {
    position: absolute;
    right: 2.5rem;
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: all 0.2s ease-in-out;

    &:hover {
      background-color: #f3f4f6;
      color: #374151;
    }

    &.listening {
      color: #ef4444;
      animation: ${pulseKeyframes} 1.5s infinite;
    }
  }

  .loading-spinner {
    position: absolute;
    right: 0.75rem;
    width: 1rem;
    height: 1rem;
    border: 2px solid #e5e7eb;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: ${spinKeyframes} 1s linear infinite;
  }

  &.small {
    .search-input {
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
    }

    .search-icon {
      left: 0.5rem;
      font-size: 0.875rem;
    }

    .clear-button,
    .microphone-button,
    .loading-spinner {
      right: 0.5rem;
      font-size: 0.875rem;
    }
  }

  &.large {
    .search-input {
      padding: 1rem 1.25rem;
      font-size: 1.125rem;
    }

    .search-icon {
      left: 1rem;
      font-size: 1.125rem;
    }

    .clear-button,
    .microphone-button,
    .loading-spinner {
      right: 1rem;
      font-size: 1.125rem;
    }
  }

  &.secondary {
    .search-input {
      background-color: #f3f4f6;
      border-color: transparent;

      &:focus {
        background-color: #ffffff;
        border-color: #d1d5db;
      }
    }
  }

  &.minimal {
    .search-input {
      border: none;
      background: transparent;
      padding-left: 2rem;

      &:focus {
        background-color: #f9fafb;
      }
    }

    .search-icon {
      left: 0.5rem;
    }

    .clear-button,
    .microphone-button {
      right: 0.5rem;
    }
  }
`;
