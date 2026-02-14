/** @jsxImportSource @emotion/react */
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import { PureComponent, ReactNode } from 'react';
import { css } from '@emotion/react';
import { getSpacing, getColor, getRadius, getBorderWidth, getShadow, getTransition } from '../utils';

const modalContainerStyles = (theme?: any) => css`
  gap: ${getSpacing(theme, 'md')};
  top: 50%;
  left: 50%;
  color: ${getColor(theme, 'text.primary')};
  width: 640px; // Fixed modal width
  max-width: 90vw;
  max-height: 100vh;
  border: ${getBorderWidth(theme, 'sm')} solid ${getColor(theme, 'border.light')};
  margin: auto;
  display: flex;
  padding: ${getSpacing(theme, 'lg')};
  z-index: ${theme?.zIndex?.modal || 1000};
  position: fixed;
  flex-direction: column;
  transform: translate(-50%, -50%);
  border-radius: ${getRadius(theme, 'md')};
  background: ${getColor(theme, 'background.primary')};
  box-shadow: ${getShadow(theme, 'lg')};
  transition: ${getTransition(theme, 'all', 'normal', 'ease')};
  
  @media (max-width: 720px) {
    gap: ${getSpacing(theme, 'md')};
    width: 95vw;
    padding: ${getSpacing(theme, 'md')};
  }
`;

const modalOverlayStyles = (theme?: any) => css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${getColor(theme, 'text.primary')}20; // 20% opacity
  z-index: ${theme?.zIndex?.overlay || 999};
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
      <div css={modalOverlayStyles(undefined)}>
        <div css={modalContainerStyles(undefined)} ref={forwardedRef}>
          {children}
        </div>
      </div>
    );
  }
}

export default ModalStyled;