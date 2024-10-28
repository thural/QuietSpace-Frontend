import { ProcedureFn } from "@/types/genericTypes";
import { GenericWrapper } from "../types/sharedComponentTypes";
import BoxStyled from "../BoxStyled";
import styles from "./styles/overlayStyles"
import DarkButton from "../buttons/DarkButton ";

interface OverlayProps extends GenericWrapper {
  isOpen: boolean
  onClose: ProcedureFn
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