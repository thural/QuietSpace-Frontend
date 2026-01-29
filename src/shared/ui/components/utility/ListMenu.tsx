import styles from "@/shared/styles/listMenuStyles";
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import { useState } from "react";
import { Container } from '@/shared/ui/components/layout/Container';

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
export interface MenuListStyleProps {
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
export interface ListMenuProps extends GenericWrapperWithRef {
    menuIcon: React.ReactNode;
    styleProps?: MenuListStyleProps;
}

/**
 * ListMenu component.
 * 
 * This component renders a menu with an icon that can be toggled to show or hide its contents.
 * The menu can be styled with various properties passed through styleProps. It also manages
 * the display state of the menu items, allowing for a simple dropdown-like functionality.
 * 
 * @param {ListMenuProps} props - The component props.
 * @returns {JSX.Element} - The rendered ListMenu component.
 */
const ListMenu: React.FC<ListMenuProps> = ({ menuIcon, styleProps, children }) => {
    const classes = styles(styleProps); // Apply styles based on provided styleProps
    const [display, setDisplay] = useState("none"); // State to manage menu visibility

    /**
     * Toggles the display state of the menu.
     * 
     * @param {React.MouseEvent} event - The mouse event triggered by the click.
     */
    const toggleDisplay = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent the event from bubbling up
        setDisplay(display === "none" ? "block" : "none"); // Toggle display state
    };

    /**
     * Hides the menu when clicked.
     * 
     * @param {React.MouseEvent} event - The mouse event triggered by the click.
     */
    const hideMenu = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent the event from bubbling up
        setDisplay("none"); // Set display to none
    };

    return (
        <>
            <Container onClick={toggleDisplay} className={classes.menuIcon}>{menuIcon}</Container> {/* Menu icon */}
            <Container className={classes.menuOverlay} style={{ display }} onClick={hideMenu}></Container> {/* Overlay for hiding the menu */}
            <Container className={classes.menuList} style={{ display }} onClick={hideMenu}>{children}</Container> {/* Menu items */}
        </>
    );
}

export default ListMenu;