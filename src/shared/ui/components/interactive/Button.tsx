/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode, MouseEvent } from 'react';
import { ButtonProps } from '../types';
import { createButtonStyles } from '../emotion-utils';

/**
 * Button Component
 * 
 * A comprehensive button component with multiple variants, sizes,
 * and states for consistent user interactions.
 * 
 * @param props - Button props for styling and behavior
 * @returns JSX Element
 */
class Button extends PureComponent<ButtonProps> {
  /**
   * Handle button click event
   */
  private handleClick = (event: MouseEvent): void => {
    const { disabled = false, loading = false, onClick } = this.props;

    if (!disabled && !loading && onClick) {
      onClick(event);
    }
  };

  override render(): ReactNode {
    const {
      children,
      theme,
      className,
      testId,
      disabled = false,
      loading = false,
      type = 'button',
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      rounded = false,
      outlined = false,
      gradient = false,
      onFocus,
      onBlur,
      onMouseEnter,
      onMouseLeave,
      ...buttonProps
    } = this.props;

    const buttonStyles = createButtonStyles(theme || {} as any, variant, size, {
      fullWidth,
      rounded,
      outlined,
      gradient,
      disabled: disabled || loading
    });

    return (
      <button
        css={buttonStyles as any}
        className={className}
        data-testid={testId}
        disabled={disabled || loading}
        type={type}
        onClick={this.handleClick}
        onFocus={onFocus}
        onBlur={onBlur}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...buttonProps}
      >
        {loading ? 'Loading...' : children}
      </button>
    );
  }
}

export default Button;
