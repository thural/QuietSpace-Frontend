import { ConsumerFn } from "@/shared/types/genericTypes";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import OverlayComponent from '@/shared/ui/components/feedback/OverlayComponent';
import React, { PureComponent, ReactNode } from 'react';

interface IOverlayProps extends GenericWrapper {
  isOpen?: boolean;
  onClose?: ConsumerFn;
  children?: ReactNode;
}

class Overlay extends PureComponent<IOverlayProps> {
  override render(): ReactNode {
    const { isOpen = false, onClose = () => { }, children } = this.props;

    if (!isOpen) return null;

    return (
      <OverlayComponent show={isOpen} onClose={onClose}>
        {children}
      </OverlayComponent>
    );
  }
}

export default Overlay;
