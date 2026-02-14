/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode, MouseEventHandler } from 'react';
import { clickableTextStyles } from './styles';
import { IClickableProps } from './interfaces';
import ClickableComponent from '../ClickableComponent';

/**
 * Enterprise Clickable Component
 * 
 * A versatile clickable wrapper component with enterprise-grade styling,
 * theme integration, and responsive design. Built with Emotion CSS
 * for optimal performance and consistency.
 * 
 * @example
 * ```tsx
 * <Clickable 
 *   handleClick={handleClick}
 *   text="Click me"
 *   altText="Clickable button"
 * >
 *   <Icon />
 * </Clickable>
 * ```
 */
class Clickable extends PureComponent<IClickableProps> {
  /**
   * Handles click event with proper event handling
   */
  private handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    const { handleClick } = this.props;
    handleClick(e);
  };

  /**
   * Renders the clickable wrapper with enterprise styling
   * 
   * @returns JSX element representing the clickable wrapper
   */
  override render(): ReactNode {
    const {
      forwardedRef,
      altText = "",
      text,
      styleProps,
      children,
      ...props
    } = this.props;

    return (
      <ClickableComponent
        ref={forwardedRef}
        onClick={this.handleClick}
        fontSize={styleProps?.fontSize}
        fontWeight={styleProps?.fontWeight}
        padding={styleProps?.padding}
        {...props}
      >
        {text && <p css={clickableTextStyles(undefined)}>{text}</p>}
        {children}
      </ClickableComponent>
    );
  }
}

export default Clickable;
