/**
 * MigrationInfo Component Interfaces
 */

import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { ReactNode } from 'react';

/**
 * Migration Status interface
 */
export interface IMigrationStatus {
  isUsingEnterprise: boolean;
  config: {
    securityLevel: 'basic' | 'enhanced' | 'maximum';
  };
  errors: Array<{
    message: string;
    timestamp: Date;
    severity: 'low' | 'medium' | 'high';
  }>;
  performance: {
    enterpriseHookTime: number;
    legacyHookTime: number;
    migrationTime: number;
  };
}

/**
 * MigrationInfo Props
 */
export interface IMigrationInfoProps extends IBaseComponentProps {
  migration: IMigrationStatus;
  showDetails?: boolean;
  showPerformance?: boolean;
  showErrors?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

/**
 * MigrationInfo State
 */
export interface IMigrationInfoState extends IBaseComponentState {
  isExpanded: boolean;
  autoRefresh: boolean;
}
