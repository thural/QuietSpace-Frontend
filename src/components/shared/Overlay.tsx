import { ConsumerFn } from "@/types/genericTypes";
import BoxStyled from "./BoxStyled";
import DarkButton from "./buttons/DarkButton ";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import styles from "@/styles/shared/overlayStyles";

interface OverlayProps extends GenericWrapper {
  isOpen: boolean
  onClose: ConsumerFn
}

const Overlay: React.FC<OverlayProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const classes = styles();

  return (
    <>
      <BoxStyled className={classes.overlay} onClick={onClose} />
      <BoxStyled className={classes.overlayContent}>
        <DarkButton className={classes.closeButton} onClick={onClose}>X</DarkButton>
        {children}
      </BoxStyled>
    </>

  );
};

export default Overlay;