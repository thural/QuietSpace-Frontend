/** @jsxImportSource @emotion/react */
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import React, { PureComponent, ReactNode, MouseEvent } from "react";
import { css } from '@emotion/react';
import { getSpacing, getColor, getRadius, getShadow, getBorderWidth, getBreakpoint } from '../utils';

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
// Enterprise Emotion CSS for list menu styling
const menuContainerStyles = (theme?: any) => css`
  position: relative;
  display: inline-block;
`;

const menuIconStyles = (theme?: any) => css`
  cursor: pointer;
  margin: 0;
  padding: ${getSpacing(theme, 'sm')};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${getRadius(theme, 'sm')};
  transition: all ${theme?.animation?.duration?.fast || '150ms'} ${theme?.animation?.easing?.ease || 'ease'};
  
  &:hover {
    background: ${getColor(theme, 'background.tertiary')};
  }
`;

const menuContentStyles = (theme?: any, styleProps?: IMenuListStyleProps) => css`
  position: ${styleProps?.position || 'absolute'};
  width: ${styleProps?.width || '200px'};
  font-size: ${styleProps?.fontSize || 'inherit'};
  font-weight: ${styleProps?.fontWeight || 'inherit'};
  border-radius: ${styleProps?.radius || getRadius(theme, 'md')};
  background: ${getColor(theme, 'background.primary')};
  border: ${getBorderWidth(theme, 'sm')} solid ${getColor(theme, 'border.medium')};
  box-shadow: ${getShadow(theme, 'md')};
  z-index: 1000;
  display: ${styleProps?.display || 'none'};
  
  // Responsive design
  @media (max-width: ${getBreakpoint(theme, 'sm')}) {
    width: ${styleProps?.width || '180px'};
    font-size: ${theme?.typography?.fontSize?.sm || '14px'};
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
      <div css={menuContainerStyles(undefined)}>
        <div css={menuIconStyles(undefined)} onClick={this.toggleDisplay}>{menuIcon}</div>
        <div
          css={menuContentStyles(undefined, { ...styleProps, display })}
          onClick={this.hideMenu}
        >
          {children}
        </div>
      </div>
    );
  }
}

export default ListMenu;