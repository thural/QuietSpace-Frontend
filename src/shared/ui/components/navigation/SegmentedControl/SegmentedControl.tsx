/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { useTheme } from '@/core/modules/theming';
import { ISegmentedControlProps, ISegmentedControlItem, ISegmentedControlState } from './interfaces';
import {
  segmentedContainerStyles,
  segmentedButtonStyles,
  segmentedSizeStyles,
  segmentedFullWidthStyles,
  segmentedResponsiveStyles
} from './styles';

/**
 * SegmentedControl Component
 * 
 * Enterprise-grade segmented control component with comprehensive theme integration,
 * animations, accessibility features, and responsive design.
 */
export class SegmentedControl extends PureComponent<ISegmentedControlProps, ISegmentedControlState> {
  static defaultProps: Partial<ISegmentedControlProps> = {
    size: 'md',
    fullWidth: false,
    disabled: false,
  };

  constructor(props: ISegmentedControlProps) {
    super(props);

    const { defaultValue, data } = props;
    this.state = {
      internalValue: defaultValue || data[0]?.value || ''
    };
  }

  /**
   * Handle value change
   */
  private handleValueChange = (newValue: string): void => {
    const { disabled, value: controlledValue, onChange } = this.props;
    const { internalValue } = this.state;
    const isControlled = controlledValue !== undefined;

    if (disabled) return;

    if (isControlled && onChange) {
      onChange(newValue);
    } else if (!isControlled) {
      this.setState({ internalValue: newValue });
    }
  };

  /**
   * Get active value
   */
  private getActiveValue = (): string => {
    const { value: controlledValue } = this.props;
    const { internalValue } = this.state;
    const isControlled = controlledValue !== undefined;
    return isControlled ? controlledValue : internalValue;
  };

  override render(): ReactNode {
    const {
      data,
      color,
      size = 'md',
      fullWidth = false,
      disabled = false,
      className,
      testId,
      id,
      onClick,
      style,
      children
    } = this.props;

    const theme = useTheme();
    const activeValue = this.getActiveValue();

    return (
      <div
        css={[
          segmentedContainerStyles(theme),
          segmentedResponsiveStyles(theme),
          fullWidth && segmentedFullWidthStyles()
        ]}
        className={className}
        data-testid={testId}
        id={id?.toString()}
        onClick={onClick}
        style={style}
      >
        {data.map((item: ISegmentedControlItem) => (
          <button
            key={item.value}
            css={[
              segmentedButtonStyles(theme, item.value === activeValue, color),
              segmentedSizeStyles(theme, size)
            ]}
            disabled={disabled || item.disabled}
            onClick={() => this.handleValueChange(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
    );
  }
}

export default SegmentedControl;
