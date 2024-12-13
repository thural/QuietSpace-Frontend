import { GenericWrapper } from "@/types/sharedComponentTypes";
import BoxStyled from "@shared/BoxStyled";
import { Link } from "react-router-dom";

/**
 * Props for the NavItem component.
 * 
 * @interface NavItemProps
 * @extends GenericWrapper
 * @property {string} linkTo - The URL path to navigate to when the item is clicked.
 * @property {string} pathName - The current pathname used for determining the active state.
 * @property {React.ReactNode} icon - The icon to display when the item is not active.
 * @property {React.ReactNode} iconFill - The icon to display when the item is active.
 */
export interface NavItemProps extends GenericWrapper {
    linkTo: string;
    pathName: string;
    icon: React.ReactNode;
    iconFill: React.ReactNode;
}

/**
 * NavItem component.
 * 
 * This component represents an individual navigation item in a navigation bar.
 * It displays an icon that changes based on whether the current path matches 
 * the provided link. When clicked, it navigates to the specified link.
 * 
 * @param {NavItemProps} props - The component props.
 * @returns {JSX.Element} - The rendered NavItem component, which includes a link 
 *                          with an icon and optional children.
 */
const NavItem: React.FC<NavItemProps> = ({ linkTo, pathName, icon, iconFill, children }) => {

    return (
        <BoxStyled className="navbar-item">
            <Link to={linkTo}>
                {/* Display the filled icon if the current path matches the link, otherwise display the regular icon */}
                {pathName.includes(linkTo.slice(0, 5)) ? iconFill : icon}
            </Link>
            {children}
        </BoxStyled>
    );
}

export default NavItem;