import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import React, { PureComponent, ReactNode, MouseEvent } from "react";
import { Container } from '@/shared/ui/components/layout/Container';
import styled from 'styled-components';
import { EnhancedTheme } from '@/core/theme';

/**
 * MenuListStyleProps interface.
 * 
 * This interface defines the style properties that can be applied to the ListMenu component.
 * 
 * @property {string} [position] - The CSS position property for the menu.
 * @property {string} [width] - The width of the menu.
 * @property {string} [fontSize] - The font size for the menu items.
 * @property {string} [fontWeight] - The font weight for the menu items.
 * @property {string} [radius] - The border radius for the menu.
 * @property {string} [iconSize] - The size of the menu icon.
 * @property {string} [padding] - The padding within the menu.
 * @property {string} [display] - The CSS display property for the menu.
 */
export interface IMenuListStyleProps {
  position?: string;
  width?: string;
  fontSize?: string;
  fontWeight?: string;
  radius?: string;
  iconSize?: string;
  padding?: string;
  display?: string;
}

/**
 * ListMenuProps interface.
 * 
 * This interface defines the props for the ListMenu component.
 * 
 * @property {React.ReactNode} menuIcon - The icon to display for the menu.
 * @property {MenuListStyleProps} [styleProps] - Optional style properties for the menu.
 */
export interface IListMenuProps extends GenericWrapperWithRef {
  menuIcon: React.ReactNode;
  styleProps?: IMenuListStyleProps;
  children?: ReactNode;
}

interface IListMenuState {
  display: string;
}

/**
 * ListMenu component.
 * 
 * This component renders a menu with an icon that can be toggled to show or hide its contents.
 * The menu can be styled with various properties passed through styleProps. It also manages
 * the display state of the menu items, allowing for a simple dropdown-like functionality.
 * 
 * @param {IListMenuProps} props - The component props.
 * @returns {JSX.Element} - The rendered ListMenu component.
 */
// Enterprise styled-components for list menu styling
const MenuContainer = styled.div<{ theme: EnhancedTheme }>`
  position: relative;
  display: inline-block;
`;

const MenuIcon = styled.div<{ theme: EnhancedTheme }>`
  cursor: pointer;
  margin: 0;
  padding: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.radius.sm};
  transition: all ${props => props.theme.animation.duration.fast} ${props => props.theme.animation.easing.ease};
  
  &:hover {
    background: ${props => props.theme.colors.background.tertiary};
  }
`;

const MenuContent = styled.div<{
  theme: EnhancedTheme;
  position?: string;
  width?: string;
  fontSize?: string;
  fontWeight?: string;
  radius?: string;
  iconSize?: string;
  padding?: string;
  display?: string;
}>`
  position: ${props => props.position || 'absolute'};
  width: ${props => props.width || '200px'};
  font-size: ${props => props.fontSize || 'inherit'};
  font-weight: ${props => props.fontWeight || 'inherit'};
  border-radius: ${props => props.radius || props.theme.radius.md};
  background: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.border.medium};
  box-shadow: ${props => props.theme.shadows.md};
  z-index: 1000;
  display: ${props => props.display || 'none'};
  
  // Responsive design
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: ${props => props.width || '180px'};
    font-size: ${props => props.theme.typography.fontSize.sm};
  }
`;

class ListMenu extends PureComponent<IListMenuProps, IListMenuState> {
  constructor(props: IListMenuProps) {
    super(props);
    this.state = {
      display: "none" // State to manage menu visibility
    };
  }

  /**
   * Toggles the display state of the menu.
   * 
   * @param {React.MouseEvent} event - The mouse event triggered by the click.
   */
  private toggleDisplay = (event: MouseEvent): void => {
    event.stopPropagation(); // Prevent the event from bubbling up
    const { display } = this.state;
    this.setState({ display: display === "none" ? "block" : "none" }); // Toggle display state
  };

  /**
   * Hides the menu when clicked.
   * 
   * @param {React.MouseEvent} event - The mouse event triggered by the click.
   */
  private hideMenu = (event: MouseEvent): void => {
    event.stopPropagation(); // Prevent the event from bubbling up
    this.setState({ display: "none" }); // Set display to none
  };

  override render(): ReactNode {
    const { menuIcon, styleProps, children } = this.props;
    const { display } = this.state;

    return (
      <MenuContainer>
        <MenuIcon onClick={this.toggleDisplay}>{menuIcon}</MenuIcon>
        <MenuContent
          {...styleProps}
          display={display}
          onClick={this.hideMenu}
        >
          {children}
        </MenuContent>
      </MenuContainer>
    );
  }
}

export default ListMenu;