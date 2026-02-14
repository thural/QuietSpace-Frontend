/** @jsxImportSource @emotion/react */
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import { overlayContainerStyles } from './styles';
import { IOverlayProps, IOverlayState } from './interfaces';
import OverlayComponent from '@/shared/ui/components/feedback/OverlayComponent';

/**
 * Enterprise Overlay Component
 * 
 * A versatile overlay component with enterprise-grade styling,
 * theme integration, and responsive design. Built with Emotion CSS
 * for optimal performance and consistency.
 * 
 * @example
 * ```tsx
 * <Overlay isOpen={true} onClose={handleClose}>
 *   <Content />
 * </Overlay>
 * ```
 */
export class Overlay extends BaseClassComponent<IOverlayProps, IOverlayState> {
  protected override getInitialState(): Partial<IOverlayState> {
    return {};
  }

  protected override renderContent(): React.ReactNode {
    const { isOpen = false, onClose = () => { }, children } = this.props;

    if (!isOpen) return null;

    return (
      <OverlayComponent show={isOpen} onClose={onClose}>
        {children}
      </OverlayComponent>
    );
  }
}
