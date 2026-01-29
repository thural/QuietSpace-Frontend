import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import styled from 'styled-components';
import React, { PureComponent, ReactNode } from 'react';

const ModalContainer = styled.div`
  gap: 1rem;
  top: 50%;
  left: 50%;
  color: #333;
  width: 640px;
  max-width: 90vw;
  max-height: 100vh;
  border: 1px solid #ddd;
  margin: auto;
  display: flex;
  padding: 2rem;
  z-index: 1000;
  position: fixed;
  flex-direction: column;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  @media (max-width: 720px) {
    gap: 1rem;
    width: 95vw;
    padding: 1rem;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface IModalStyledProps extends GenericWrapperWithRef {
  children?: ReactNode;
}

class ModalStyled extends PureComponent<IModalStyledProps> {
  render(): ReactNode {
    const { children, forwardedRef } = this.props;
    return (
      <ModalOverlay>
        <ModalContainer ref={forwardedRef}>
          {children}
        </ModalContainer>
      </ModalOverlay>
    );
  }
}

export default ModalStyled;