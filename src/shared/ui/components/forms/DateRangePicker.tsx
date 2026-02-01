/**
 * Date Range Picker Component
 * 
 * A reusable date range selection component with start and end date inputs.
 * Provides flexible date selection with validation and callback support.
 */

import React from 'react';
import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

/**
 * Date Range interface
 */
export interface IDateRange {
  startDate: Date;
  endDate: Date;
}

/**
 * Date Range Picker Props
 */
export interface IDateRangePickerProps extends IBaseComponentProps {
  initialDateRange?: IDateRange;
  minDate?: Date;
  maxDate?: Date;
  onDateRangeChange?: (dateRange: IDateRange) => void;
  disabled?: boolean;
  className?: string;
  startLabel?: string;
  endLabel?: string;
  showPresets?: boolean;
  presets?: Array<{
    label: string;
    startDate: Date;
    endDate: Date;
  }>;
}

/**
 * Date Range Picker State
 */
export interface IDateRangePickerState extends IBaseComponentState {
  dateRange: IDateRange;
  isValid: boolean;
  errorMessage: string | null;
}

/**
 * Date Range Picker Component
 * 
 * Provides date range selection with:
 * - Start and end date inputs
 * - Date validation and error handling
 * - Preset date ranges for quick selection
 * - Flexible callback support for date changes
 * - Accessibility features and keyboard navigation
 * 
 * Built using enterprise BaseClassComponent pattern with lifecycle management.
 */
export class DateRangePicker extends BaseClassComponent<IDateRangePickerProps, IDateRangePickerState> {
  
  protected override getInitialState(): Partial<IDateRangePickerState> {
    const { initialDateRange } = this.props;

    return {
      dateRange: initialDateRange || {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        endDate: new Date()
      },
      isValid: true,
      errorMessage: null
    };
  }

  /**
   * Validate date range
   */
  private validateDateRange = (startDate: Date, endDate: Date): { isValid: boolean; errorMessage: string | null } => {
    const { minDate, maxDate } = this.props;

    // Check if start date is after end date
    if (startDate > endDate) {
      return {
        isValid: false,
        errorMessage: 'Start date must be before or equal to end date'
      };
    }

    // Check minimum date constraint
    if (minDate && startDate < minDate) {
      return {
        isValid: false,
        errorMessage: `Start date must be after ${minDate.toLocaleDateString()}`
      };
    }

    // Check maximum date constraint
    if (maxDate && endDate > maxDate) {
      return {
        isValid: false,
        errorMessage: `End date must be before ${maxDate.toLocaleDateString()}`
      };
    }

    return { isValid: true, errorMessage: null };
  };

  /**
   * Handle start date change
   */
  private handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newStartDate = new Date(e.target.value);
    const newDateRange = {
      ...this.state.dateRange,
      startDate: newStartDate
    };

    const validation = this.validateDateRange(newStartDate, newDateRange.endDate);

    this.safeSetState({
      dateRange: newDateRange,
      isValid: validation.isValid,
      errorMessage: validation.errorMessage
    });

    if (validation.isValid && this.props.onDateRangeChange) {
      this.props.onDateRangeChange(newDateRange);
    }
  };

  /**
   * Handle end date change
   */
  private handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newEndDate = new Date(e.target.value);
    const newDateRange = {
      ...this.state.dateRange,
      endDate: newEndDate
    };

    const validation = this.validateDateRange(this.state.dateRange.startDate, newEndDate);

    this.safeSetState({
      dateRange: newDateRange,
      isValid: validation.isValid,
      errorMessage: validation.errorMessage
    });

    if (validation.isValid && this.props.onDateRangeChange) {
      this.props.onDateRangeChange(newDateRange);
    }
  };

  /**
   * Apply preset date range
   */
  private applyPreset = (preset: { label: string; startDate: Date; endDate: Date }): void => {
    const validation = this.validateDateRange(preset.startDate, preset.endDate);

    this.safeSetState({
      dateRange: {
        startDate: preset.startDate,
        endDate: preset.endDate
      },
      isValid: validation.isValid,
      errorMessage: validation.errorMessage
    });

    if (validation.isValid && this.props.onDateRangeChange) {
      this.props.onDateRangeChange({
        startDate: preset.startDate,
        endDate: preset.endDate
      });
    }
  };

  /**
   * Format date for input
   */
  private formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  /**
   * Render preset buttons
   */
  private renderPresets(): React.ReactNode {
    const { presets = [] } = this.props;

    if (!this.props.showPresets || presets.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {presets.map((preset, index) => (
          <button
            key={index}
            onClick={() => this.applyPreset(preset)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>
    );
  }

  protected override renderContent(): React.ReactNode {
    const { 
      disabled = false,
      className = '',
      startLabel = 'Start Date',
      endLabel = 'End Date'
    } = this.props;

    const { dateRange, isValid, errorMessage } = this.state;

    return (
      <div className={`date-range-picker ${className}`}>
        {/* Presets */}
        {this.renderPresets()}

        {/* Date Inputs */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Start Date */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {startLabel}
            </label>
            <input
              type="date"
              value={this.formatDateForInput(dateRange.startDate)}
              onChange={this.handleStartDateChange}
              disabled={disabled}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !isValid ? 'border-red-500' : 'border-gray-300'
              } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
              aria-label={startLabel}
            />
          </div>

          {/* End Date */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {endLabel}
            </label>
            <input
              type="date"
              value={this.formatDateForInput(dateRange.endDate)}
              onChange={this.handleEndDateChange}
              disabled={disabled}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !isValid ? 'border-red-500' : 'border-gray-300'
              } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
              aria-label={endLabel}
            />
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-2 text-sm text-red-600" role="alert">
            {errorMessage}
          </div>
        )}

        {/* Date Range Summary */}
        {isValid && (
          <div className="mt-2 text-sm text-gray-600">
            Selected: {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
            <span className="ml-2">
              ({Math.ceil((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24))} days)
            </span>
          </div>
        )}
      </div>
    );
  }
}

export default DateRangePicker;
