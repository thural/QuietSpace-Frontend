/** @jsxImportSource @emotion/react */
import React, { PureComponent, ReactNode } from 'react';
import { overlayWrapperStyles, overlayBackdropStyles, overlayContentStyles, overlayCloseButtonStyles } from "./OverlayStyles";

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

  override render(): ReactNode {
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
      <div css={overlayWrapperStyles({} as any)}>
        {backdrop && (
          <div css={overlayBackdropStyles({} as any)} onClick={this.handleBackdropClick} />
        )}
        <div css={overlayContentStyles({} as any)} className={className} {...props}>
          {closeable && (
            <button css={overlayCloseButtonStyles({} as any)} onClick={this.handleClose}>
              ×
            </button>
          )}
          {children}
        </div>
      </div>
    );
  }
}

export default OverlayComponent;
