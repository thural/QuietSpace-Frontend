/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode, MouseEvent } from 'react';
import { clickableContainerStyles } from './styles';
import { IClickableComponentProps } from './interfaces';
import { getSpacing } from '../../utils';

/**
 * Enterprise Clickable Component
 * 
 * A versatile clickable container component with multiple variants,
 * theme integration, and accessibility features. Built with enterprise
 * patterns and Emotion CSS for optimal performance.
 * 
 * @example
 * ```tsx
 * <ClickableComponent 
 *   variant="primary" 
 *   onClick={handleClick}
 *   disabled={false}
 * >
 *   Click me
 * </ClickableComponent>
 * ```
 */
class ClickableComponent extends PureComponent<IClickableComponentProps> {
  static defaultProps: Partial<IClickableComponentProps> = {
    disabled: false,
    variant: 'default'
  };

  /**
   * Handles click events with disabled state checking
   * 
   * @param event - Mouse click event
   */
  private handleClick = (event: MouseEvent<HTMLDivElement>): void => {
    const { disabled, onClick } = this.props;
    if (!disabled) {
      onClick?.(event);
    }
  };

  /**
   * Renders the clickable component with appropriate styles and behavior
   * 
   * @returns JSX element representing the clickable container
   */
  override render(): ReactNode {
    const {
      children,
      fontSize,
      fontWeight,
      padding,
      height,
      disabled = false,
      variant = 'default',
      className,
      onClick,
      ...props
    } = this.props;

    return (
      <div
        css={clickableContainerStyles(undefined, variant, disabled)}
        className={className}
        onClick={disabled ? undefined : this.handleClick}
        style={{
          fontSize: fontSize || 'inherit',
          fontWeight: fontWeight || 'inherit',
          padding: padding || getSpacing({} as any, 'sm'),
          height: height || 'auto',
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
}

export default ClickableComponent;
