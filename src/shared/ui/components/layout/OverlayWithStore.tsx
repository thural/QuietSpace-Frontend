import { viewStore } from "@/core/store/zustand";
import styles from "@/shared/styles/overlayStyles";
import { Container } from "@/shared/ui/components/layout/Container";


const OverlayWithStore = ({ closable }: { closable: Object }) => {
  const { data: viewState, setViewData } = viewStore();
  const classes = styles();
  const active = !(closable === undefined || closable === null);

  const handleClick = () => {
    if (active) setViewData(viewState, { overlay: false, ...closable });
  }

  return (
    <Container className={classes.overlay} onClick={handleClick}></Container>
  )
}

export default OverlayWithStore