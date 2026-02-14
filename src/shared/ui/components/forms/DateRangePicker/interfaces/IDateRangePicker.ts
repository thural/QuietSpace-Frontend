import { IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';

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
