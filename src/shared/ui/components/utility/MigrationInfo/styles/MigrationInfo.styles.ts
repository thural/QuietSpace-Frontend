/**
 * MigrationInfo Component Styles
 */

import { css } from '@emotion/react';

/**
 * Base migration info container styles
 */
export const migrationInfoContainerStyles = css`
  padding: 1rem;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background-color: #f8f9fa;
  margin-bottom: 1rem;

  .migration-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .migration-title {
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .migration-status {
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;

    &.enterprise {
      background-color: #d1fae5;
      color: #065f46;
    }

    &.legacy {
      background-color: #fee2e2;
      color: #991b1b;
    }
  }

  .migration-content {
    font-size: 0.875rem;
    color: #4b5563;
    line-height: 1.4;
  }

  .migration-details {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;

    .detail-section {
      margin-bottom: 1rem;

      .detail-title {
        font-weight: 600;
        color: #374151;
        margin-bottom: 0.5rem;
      }

      .detail-content {
        font-size: 0.875rem;
        color: #6b7280;
      }
    }
  }

  .migration-errors {
    margin-top: 1rem;

    .error-item {
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;

      &.low {
        background-color: #fef3c7;
        color: #92400e;
      }

      &.medium {
        background-color: #fed7aa;
        color: #92400e;
      }

      &.high {
        background-color: #fecaca;
        color: #991b1b;
      }
    }
  }

  .performance-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-top: 1rem;

    .metric {
      text-align: center;
      padding: 0.5rem;
      background-color: #ffffff;
      border-radius: 4px;
      border: 1px solid #e5e7eb;

      .metric-value {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1f2937;
      }

      .metric-label {
        font-size: 0.75rem;
        color: #6b7280;
        margin-top: 0.25rem;
      }
    }
  }

  &.compact {
    padding: 0.5rem;
    font-size: 0.8rem;
  }

  &.detailed {
    padding: 1.5rem;
    border-radius: 12px;
  }
`;
