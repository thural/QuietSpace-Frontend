/** @jsxImportSource @emotion/react */
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import { 
  overlayWrapperStyles, 
  overlayBackdropStyles, 
  overlayContentStyles, 
  overlayCloseButtonStyles 
} from './styles';
import { IOverlayComponentProps, IOverlayComponentState } from './interfaces';

/**
 * Enterprise OverlayComponent
 * 
 * A flexible overlay component with backdrop and close functionality.
 * Built using enterprise BaseClassComponent pattern with Emotion CSS.
 * 
 * @example
 * ```tsx
 * <OverlayComponent 
 *   show={isOpen}
 *   onClose={handleClose}
 *   backdrop={true}
 *   closeable={true}
 * >
 *   <Content />
 * </OverlayComponent>
 * ```
 */
export class OverlayComponent extends BaseClassComponent<IOverlayComponentProps, IOverlayComponentState> {
  static defaultProps: Partial<IOverlayComponentProps> = {
    backdrop: true,
    closeable: true
  };

  protected override getInitialState(): Partial<IOverlayComponentState> {
    return {};
  }

  /**
   * Handle backdrop click
   */
  private handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    const { backdrop, onClose } = this.props;
    if (backdrop && event.target === event.currentTarget) {
      onClose?.();
    }
  };

  /**
   * Handle close
   */
  private handleClose = (): void => {
    const { onClose } = this.props;
    onClose?.();
  };

  protected override renderContent(): React.ReactNode {
    const {
      show,
      children,
      className,
      backdrop,
      closeable,
      testId,
      id,
      onClick,
      style,
      ...props
    } = this.props;

    if (!show) {
      return null;
    }

    return (
      <div 
        css={overlayWrapperStyles}
        data-testid={testId}
        id={id?.toString()}
        onClick={onClick}
        style={style}
      >
        {backdrop && (
          <div css={overlayBackdropStyles} onClick={this.handleBackdropClick} />
        )}
        <div css={overlayContentStyles} className={className} {...props}>
          {closeable && (
            <button css={overlayCloseButtonStyles} onClick={this.handleClose}>
              ×
            </button>
          )}
          {children}
        </div>
      </div>
    );
  }
}
