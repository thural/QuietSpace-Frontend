import { viewStore } from "@/core/store/zustand";
import { Container } from "@/shared/ui/components/layout/Container";
import OverlayComponent from '@/shared/ui/components/feedback/OverlayComponent';


const OverlayWithStore = ({ closable }: { closable: Object }) => {
  const { data: viewState, setViewData } = viewStore();
  const active = !(closable === undefined || closable === null);

  const handleClick = () => {
    if (active) setViewData(viewState, { overlay: false, ...closable });
  }

  return (
    <OverlayComponent show={active} onClose={handleClick}>
      <Container onClick={handleClick}></Container>
    </OverlayComponent>
  )
}

export default OverlayWithStore