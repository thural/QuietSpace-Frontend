import { viewStore } from "@/core/store/zustand";
import styles from "@/shared/styles/overlayStyles";
import BoxStyled from "./BoxStyled";


const OverlayWithStore = ({ closable }: { closable: Object }) => {
  const { data: viewState, setViewData } = viewStore();
  const classes = styles();
  const active = !(closable === undefined || closable === null);

  const handleClick = () => {
    if (active) setViewData(viewState, { overlay: false, ...closable });
  }

  return (
    <BoxStyled className={classes.overlay} onClick={handleClick}></BoxStyled>
  )
}

export default OverlayWithStore