import { GenericWrapper } from "@/types/sharedComponentTypes"
import BoxStyled from "@shared/BoxStyled"
import { Link } from "react-router-dom"

export interface NavItemProps extends GenericWrapper {
    linkTo: string,
    pathName: string,
    icon: React.ReactNode,
    iconFill: React.ReactNode,
}

const NavItem: React.FC<NavItemProps> = ({ linkTo, pathName, icon, iconFill, children }) => {

    return (
        <BoxStyled className="navbar-item">
            <Link to={linkTo}>
                {pathName.includes(linkTo.slice(0, 5)) ? iconFill : icon}
            </Link>
            {children}
        </BoxStyled>
    )
}

export default NavItem