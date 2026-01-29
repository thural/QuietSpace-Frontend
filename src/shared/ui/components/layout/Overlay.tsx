import { ConsumerFn } from "@/shared/types/genericTypes";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import OverlayComponent from '@/shared/ui/components/feedback/OverlayComponent';

interface OverlayProps extends GenericWrapper {
  isOpen?: boolean;
  onClose?: ConsumerFn;
}

const Overlay: React.FC<OverlayProps> = ({ isOpen = false, onClose = () => { }, children }) => {
  if (!isOpen) return null;

  return (
    <OverlayComponent show={isOpen} onClose={onClose}>
      {children}
    </OverlayComponent>
  );
};

export default Overlay;
