/** @jsxImportSource @emotion/react */
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import FlexStyled from "./FlexStyled";
import { PureComponent, ReactNode } from 'react';
import { css } from '@emotion/react';
import { getColor, getBorderWidth, getRadius, getSpacing, getShadow, getTransition, getBreakpoint } from '../utils';

// Enterprise Emotion CSS for base card styling
const baseCardContainerStyles = (theme?: any) => css`
  background: ${getColor(theme, 'background.primary')};
  border: ${getBorderWidth(theme, 'sm')} solid ${getColor(theme, 'border.medium')};
  border-radius: ${getRadius(theme, 'md')};
  padding: ${getSpacing(theme, 'md')};
  box-shadow: ${getShadow(theme, 'sm')};
  transition: ${getTransition(theme, 'all', 'normal', 'ease')};
  
  &:hover {
    box-shadow: ${getShadow(theme, 'md')};
    border-color: ${getColor(theme, 'border.dark')};
  }
  
  // Responsive design
  @media (max-width: ${getBreakpoint(theme, 'sm')}) {
    padding: ${getSpacing(theme, 'sm')};
  }
`;

class BaseCard extends PureComponent<GenericWrapper> {
  override render(): ReactNode {
    const { children, theme } = this.props;

    return (
      <div css={baseCardContainerStyles(theme)}>
        <FlexStyled theme={theme}>{children}</FlexStyled>
      </div>
    );
  }
}

export default BaseCard;