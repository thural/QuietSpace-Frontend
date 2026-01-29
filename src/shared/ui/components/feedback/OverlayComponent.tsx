import { OverlayWrapper, OverlayBackdrop, OverlayContent, OverlayCloseButton } from "./OverlayStyles";
import React, { PureComponent, ReactNode } from 'react';
import { GenericWrapper } from "@shared-types/sharedComponentTypes";

interface IOverlayProps {
  show: boolean;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
  backdrop?: boolean;
  closeable?: boolean;
}

/**
 * Enterprise Overlay Component
 * 
 * Replaces JSS-based overlayStyles.ts with enterprise styled-components
 * following theme system patterns and class component best practices.
 */
class OverlayComponent extends PureComponent<IOverlayProps> {
  static defaultProps: Partial<IOverlayProps> = {
    backdrop: true,
    closeable: true
  };

  private handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    const { backdrop, onClose } = this.props;
    if (backdrop && event.target === event.currentTarget) {
      onClose?.();
    }
  };

  private handleClose = (): void => {
    const { onClose } = this.props;
    onClose?.();
  };

  render(): ReactNode {
    const {
      show,
      children,
      className,
      backdrop,
      closeable,
      onClose,
      ...props
    } = this.props;

    if (!show) {
      return null;
    }

    return (
      <OverlayWrapper>
        {backdrop && (
          <OverlayBackdrop onClick={this.handleBackdropClick} />
        )}
        <OverlayContent className={className} {...props}>
          {closeable && (
            <OverlayCloseButton onClick={this.handleClose}>
              ×
            </OverlayCloseButton>
          )}
          {children}
        </OverlayContent>
      </OverlayWrapper>
    );
  }
}

export default OverlayComponent;
