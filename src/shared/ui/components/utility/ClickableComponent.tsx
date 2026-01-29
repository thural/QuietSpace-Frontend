import { ClickableContainer } from "./ClickableStyles";
import React, { PureComponent, ReactNode } from 'react';

interface IClickableProps {
  children: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'secondary';
  fontSize?: string;
  fontWeight?: string;
  padding?: string;
  height?: string;
}

/**
 * Enterprise Clickable Component
 * 
 * Replaces JSS-based clickableStyles.ts with enterprise styled-components
 * following theme system patterns and class component best practices.
 */
class ClickableComponent extends PureComponent<IClickableProps> {
  static defaultProps: Partial<IClickableProps> = {
    disabled: false,
    variant: 'default'
  };

  private handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    const { disabled, onClick } = this.props;
    if (!disabled) {
      onClick?.(event);
    }
  };

  render(): ReactNode {
    const {
      children,
      fontSize,
      fontWeight,
      padding,
      height,
      disabled,
      className,
      ...props
    } = this.props;

    return (
      <ClickableContainer
        fontSize={fontSize}
        fontWeight={fontWeight}
        padding={padding}
        height={height}
        onClick={this.handleClick}
        className={className}
        style={{
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
        {...props}
      >
        {children}
      </ClickableContainer>
    );
  }
}

export default ClickableComponent;
