import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import styled from 'styled-components';
import { EnhancedTheme } from '../core/theme';

const ModalContainer = styled.div<{ theme: EnhancedTheme }>`
  gap: ${props => props.theme.spacing.sm};
  top: 50%;
  left: 50%;
  color: ${props => props.theme.colors.text.primary};
  width: 640px;
  max-width: 90vw;
  max-height: 100vh;
  border: 1px solid ${props => props.theme.colors.border.medium};
  margin: auto;
  display: flex;
  padding: ${props => props.theme.spacing.xl};
  z-index: ${props => props.theme.zIndex.modal || 1000};
  position: fixed;
  flex-direction: column;
  transform: translate(-50%, -50%);
  border-radius: ${props => props.theme.radius.md};
  background: ${props => props.theme.colors.background.primary};
  box-shadow: ${props => props.theme.shadows.lg};
  transition: all ${props => props.theme.animation.duration.normal} ${props => props.theme.animation.easing.ease};
  
  @media (max-width: 720px) {
    gap: ${props => props.theme.spacing.sm};
    width: 95vw;
    padding: ${props => props.theme.spacing.md};
  }
`;

const ModalOverlay = styled.div<{ theme: EnhancedTheme }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: ${props => (props.theme.zIndex.modal || 1000) - 1};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalStyled: React.FC<GenericWrapperWithRef> = ({ children, ...props }) => {
    return (
        <ModalOverlay>
            <ModalContainer ref={props.ref}>
                {children}
            </ModalContainer>
        </ModalOverlay>
    );
};

export default ModalStyled;