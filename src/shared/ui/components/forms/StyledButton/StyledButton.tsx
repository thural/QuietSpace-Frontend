import { BaseClassComponent, IBaseComponentProps, IBaseComponentState } from '@/shared/components/base/BaseClassComponent';
import { ReactNode } from 'react';
import { IStyledButtonProps, IStyledButtonState } from './interfaces';
import { BaseButtonStyles, VariantStyles, SizeStyles } from './styles';

/**
 * Extended props interface for StyledButton component
 */
interface IStyledButtonExtendedProps extends IStyledButtonProps, IBaseComponentProps {
  /** Additional className for styling */
  className?: string;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Extended state interface for StyledButton component
 */
interface IStyledButtonExtendedState extends IStyledButtonState, IBaseComponentState {
  /** Additional state properties if needed */
}

/**
 * Enterprise StyledButton Component
 * 
 * Optimized button component with variants and sizes.
 * Provides consistent button styling across the application.
 * Follows enterprise architecture patterns with proper decoupling.
 */
export class StyledButton extends BaseClassComponent<IStyledButtonExtendedProps, IStyledButtonExtendedState> {
  static defaultProps: Partial<IStyledButtonExtendedProps> = {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false
  };

  protected override getInitialState(): Partial<IStyledButtonExtendedState> {
    return {};
  }

  protected override renderContent(): ReactNode {
    const {
      variant = 'primary',
      size = 'md',
      className,
      testId = 'styled-button',
      onClick,
      type = 'button',
      disabled = false,
      children,
      theme,
      ...rest
    } = this.props;

    return (
      <button
        css={[
          BaseButtonStyles(theme || {} as any),
          VariantStyles(theme || {} as any, variant),
          SizeStyles(theme || {} as any, size)
        ]}
        className={className}
        data-testid={testId}
        onClick={onClick}
        type={type}
        disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    );
  }
}

export default StyledButton;
