/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { getCloseButtonStyles } from './styles';
import { ICloseButtonStyledProps } from './interfaces';

/**
 * Enterprise CloseButtonStyled Component
 * 
 * A versatile close button component with enterprise-grade styling,
 * theme integration, and responsive design. Built with Emotion CSS
 * for optimal performance and consistency.
 * 
 * @example
 * ```tsx
 * <CloseButtonStyled 
 *   handleToggle={handleClose}
 *   variant="danger"
 *   disabled={false}
 * />
 * ```
 */
class CloseButtonStyled extends PureComponent<ICloseButtonStyledProps> {
  static defaultProps: Partial<ICloseButtonStyledProps> = {
    disabled: false,
    variant: 'default'
  };

  /**
   * Handles click events with disabled state checking
   */
  private handleClick = (): void => {
    const { disabled, handleToggle } = this.props;
    if (!disabled) {
      handleToggle();
    }
  };

  /**
   * Renders the close button with enterprise styling
   * 
   * @returns JSX element representing the close button
   */
  override render(): ReactNode {
    const { className, disabled, variant } = this.props;

    return (
      <button
        css={getCloseButtonStyles(undefined, variant, disabled)}
        onClick={this.handleClick}
        disabled={disabled}
        className={`close-button ${className || ''} close-button-${variant}`}
        aria-label="Close"
      >
        ×
      </button>
    );
  }
}

export default CloseButtonStyled;
