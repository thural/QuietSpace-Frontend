import styles from "@/styles/shared/overlayStyles";
import { ConsumerFn } from "@/types/genericTypes";
import { GenericWrapper } from "@/types/sharedComponentTypes";

interface OverlayProps extends GenericWrapper {
  isOpen?: boolean;
  onClose?: ConsumerFn;
}

const Overlay: React.FC<OverlayProps> = ({ isOpen = false, onClose = () => { }, children }) => {
  const classes = styles();

  if (!isOpen) return null;
  if (!onClose) throw new Error("onClose handler is not provided");

  return (
    <div className={classes.overlayWrapper}>
      <div className={classes.overlay} onClick={onClose} />
      <div className={classes.overlayContent}>
        <button className={classes.closeButton} onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default Overlay;
