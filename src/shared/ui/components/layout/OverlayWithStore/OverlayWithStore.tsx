/** @jsxImportSource @emotion/react */
import { BaseClassComponent } from '@/shared/components/base/BaseClassComponent';
import { overlayWithStoreStyles } from './styles';
import { IOverlayWithStoreProps, IOverlayWithStoreState } from './interfaces';
import { viewStore } from "@/core/store/zustand";
import { Container } from "../Container";
import OverlayComponent from '@/shared/ui/components/feedback/OverlayComponent';

/**
 * Enterprise OverlayWithStore Component
 * 
 * A versatile overlay component with store integration and enterprise-grade styling,
 * theme integration, and responsive design. Built with Emotion CSS
 * for optimal performance and consistency.
 * 
 * @example
 * ```tsx
 * <OverlayWithStore closable={overlayData}>
 *   <Content />
 * </OverlayWithStore>
 * ```
 */
export class OverlayWithStore extends BaseClassComponent<IOverlayWithStoreProps, IOverlayWithStoreState> {
  protected override getInitialState(): Partial<IOverlayWithStoreState> {
    return {
      active: false
    };
  }

  /**
   * Handle click to close overlay
   */
  private handleClick = (): void => {
    const { closable } = this.props;
    const { data: viewState, setViewData } = viewStore();

    if (closable !== undefined && closable !== null) {
      setViewData(viewState, { overlay: false, ...closable });
    }
  };

  protected override renderContent(): React.ReactNode {
    const { closable, children } = this.props;
    const { active } = this.state;

    return (
      <OverlayComponent show={active} onClose={this.handleClick}>
        <Container onClick={this.handleClick} css={overlayWithStoreStyles}>
          {children}
        </Container>
      </OverlayComponent>
    );
  }
}
