import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import styled from 'styled-components';
import { PureComponent, ReactNode } from 'react';
import { getSpacing, getColor, getRadius, getBorderWidth, getShadow, getTransition } from '../utils';

const ModalContainer = styled.div<{ theme?: any }>`
  gap: ${props => getSpacing(props.theme, 'md')};
  top: 50%;
  left: 50%;
  color: ${props => getColor(props.theme, 'text.primary')};
  width: 640px;
  max-width: 90vw;
  max-height: 100vh;
  border: ${props => getBorderWidth(props.theme, 'sm')} solid ${props => getColor(props.theme, 'border.light')};
  margin: auto;
  display: flex;
  padding: ${props => getSpacing(props.theme, 'lg')};
  z-index: 1000;
  position: fixed;
  flex-direction: column;
  transform: translate(-50%, -50%);
  border-radius: ${props => getRadius(props.theme, 'md')};
  background: ${props => getColor(props.theme, 'background.primary')};
  box-shadow: ${props => getShadow(props.theme, 'lg')};
  transition: ${props => getTransition(props.theme, 'all', 'normal', 'ease')};
  
  @media (max-width: 720px) {
    gap: 1rem;
    width: 95vw;
    padding: 1rem;
  }
`;

const ModalOverlay = styled.div<{ theme?: any }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${props => getColor(props.theme, 'text.primary')}20;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface IModalStyledProps extends GenericWrapperWithRef {
  children?: ReactNode;
}

class ModalStyled extends PureComponent<IModalStyledProps> {
  override render(): ReactNode {
    const { children, forwardedRef } = this.props;
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