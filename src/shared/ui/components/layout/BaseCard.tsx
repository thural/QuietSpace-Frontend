import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import FlexStyled from "./FlexStyled";
import styled from 'styled-components';
import { PureComponent, ReactNode } from 'react';
import { getColor, getBorderWidth, getRadius, getSpacing, getShadow, getTransition, getBreakpoint } from '../utils';

// Enterprise styled-components for base card styling
const BaseCardContainer = styled.div<{ theme: any }>`
  background: ${props => getColor(props.theme, 'background.primary')};
  border: ${props => getBorderWidth(props.theme, 'sm')} solid ${props => getColor(props.theme, 'border.medium')};
  border-radius: ${props => getRadius(props.theme, 'md')};
  padding: ${props => getSpacing(props.theme, 'md')};
  box-shadow: ${props => getShadow(props.theme, 'sm')};
  transition: ${props => getTransition(props.theme, 'all', 'normal', 'ease')};
  
  &:hover {
    box-shadow: ${props => getShadow(props.theme, 'md')};
    border-color: ${props => getColor(props.theme, 'border.dark')};
  }
  
  // Responsive design
  @media (max-width: ${props => getBreakpoint(props.theme, 'sm')}) {
    padding: ${props => getSpacing(props.theme, 'sm')};
  }
`;

class BaseCard extends PureComponent<GenericWrapper> {
  override render(): ReactNode {
    const { children, theme } = this.props;

    return (
      <BaseCardContainer theme={theme}>
        <FlexStyled theme={theme}>{children}</FlexStyled>
      </BaseCardContainer>
    );
  }
}

export default BaseCard;