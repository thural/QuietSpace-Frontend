import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import styled from 'styled-components';
import { PureComponent, ReactNode } from 'react';
import { getSpacing, getColor, getRadius, getBorderWidth, getShadow, getTransition } from '../utils';

const ModalContainer = styled.div<{ theme?: any }>`
  gap: ${props => getSpacing(props.theme, 'md')};
  top: 50%;
  left: 50%;
  color: ${props => getColor(props.theme, 'text.primary')};
  width: 640px; // Fixed modal width
  max-width: 90vw;
  max-height: 100vh;
  border: ${props => getBorderWidth(props.theme, 'sm')} solid ${props => getColor(props.theme, 'border.light')};
  margin: auto;
  display: flex;
  padding: ${props => getSpacing(props.theme, 'lg')};
  z-index: ${(props): number => (props.theme as any)?.zIndex?.modal || 1000};
  position: fixed;
  flex-direction: column;
  transform: translate(-50%, -50%);
  border-radius: ${props => getRadius(props.theme, 'md')};
  background: ${props => getColor(props.theme, 'background.primary')};
  box-shadow: ${props => getShadow(props.theme, 'lg')};
  transition: ${props => getTransition(props.theme, 'all', 'normal', 'ease')};
  
  @media (max-width: 720px) {
    gap: ${props => getSpacing(props.theme, 'md')};
    width: 95vw;
    padding: ${props => getSpacing(props.theme, 'md')};
  }
`;

const ModalOverlay = styled.div<{ theme?: any }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${props => getColor(props.theme, 'text.primary')}20; // 20% opacity
  z-index: ${(props): number => (props.theme as any)?.zIndex?.overlay || 999};
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface IModalStyledProps extends GenericWrapper {
  children?: ReactNode;
  forwardedRef?: any;
}

class ModalStyled extends PureComponent<IModalStyledProps> {
  public override render(): ReactNode {
    const props = this.props as IModalStyledProps;
    const { children, forwardedRef } = props;
    return (
      <ModalOverlay theme={undefined}>
        <ModalContainer ref={forwardedRef} theme={undefined}>
          {children}
        </ModalContainer>
      </ModalOverlay>
    );
  }
}

export default ModalStyled;