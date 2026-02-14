/** @jsxImportSource @emotion/react */
import { PureComponent, ReactNode } from 'react';
import { useTheme } from '@/core/modules/theming';
import { IModalStyledProps } from './interfaces';
import { 
  modalOverlayStyles, 
  modalContainerStyles 
} from './styles';

/**
 * ModalStyled Component
 * 
 * Enterprise-grade modal component with overlay, positioning, and
 * accessibility features. Follows decoupled architecture with clean
 * separation of interfaces, styles, and component logic.
 * 
 * @author QuietSpace UI Library
 * @version 1.0.0
 */
class ModalStyled extends PureComponent<IModalStyledProps> {
  /**
   * Handle overlay click
   */
  private handleOverlayClick = (event: React.MouseEvent) => {
    const { closeOnOverlayClick, onClose } = this.props;
    
    if (closeOnOverlayClick && onClose) {
      // Only close if clicking directly on overlay, not on content
      if (event.target === event.currentTarget) {
        onClose();
      }
    }
  };

  /**
   * Handle escape key press
   */
  private handleKeyDown = (event: KeyboardEvent) => {
    const { onClose } = this.props;
    
    if (event.key === 'Escape' && onClose) {
      onClose();
    }
  };

  override componentDidMount() {
    const { preventBodyScroll, isOpen } = this.props;
    
    // Add escape key listener
    document.addEventListener('keydown', this.handleKeyDown);
    
    // Prevent body scroll when modal is open
    if (preventBodyScroll && isOpen) {
      document.body.style.overflow = 'hidden';
    }
  }

  override componentDidUpdate(prevProps: IModalStyledProps) {
    const { preventBodyScroll, isOpen } = this.props;
    
    // Handle body scroll prevention
    if (preventBodyScroll) {
      if (isOpen && !prevProps.isOpen) {
        document.body.style.overflow = 'hidden';
      } else if (!isOpen && prevProps.isOpen) {
        document.body.style.overflow = '';
      }
    }
  }

  override componentWillUnmount() {
    // Clean up event listeners and body scroll
    document.removeEventListener('keydown', this.handleKeyDown);
    document.body.style.overflow = '';
  }

  public override render(): ReactNode {
    const { 
      children, 
      forwardedRef, 
      isOpen = true,
      showOverlay = true,
      size = 'medium',
      position = 'center',
      zIndex,
      backdropBlur = false,
      overlayClassName,
      containerClassName
    } = this.props;

    const theme = useTheme();

    // Don't render if modal is not open
    if (!isOpen) {
      return null;
    }

    return (
      <div
        css={modalOverlayStyles(theme, { 
          backdropBlur, 
          showOverlay 
        })}
        className={overlayClassName}
        onClick={this.handleOverlayClick}
        style={{ zIndex: zIndex || theme?.zIndex?.overlay || 999 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={this.props['aria-labelledby']}
        aria-describedby={this.props['aria-describedby']}
      >
        <div
          css={modalContainerStyles(theme, { 
            size, 
            position 
          })}
          className={containerClassName}
          ref={forwardedRef}
          role="document"
        >
          {children}
        </div>
      </div>
    );
  }
}

export default ModalStyled;
