import { viewStore } from "@/hooks/zustand";
import styles from "./styles/overlayStyles";


const Overlay = ({ closable }: { closable: Object }) => {
  const { data: viewState, setViewData } = viewStore();
  const classes = styles();
  const active = !(closable === undefined || closable === null);

  const handleClick = () => {
    if (active) setViewData(viewState, { overlay: false, ...closable });
  }

  return (
    <div className={classes.overlay} onClick={handleClick}></div>
  )
}

export default Overlay