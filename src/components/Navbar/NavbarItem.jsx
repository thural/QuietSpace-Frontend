import BoxStyled from "@shared/BoxStyled"
import { Link } from "react-router-dom"

const NavbarItem = ({ linkTo, pathName, icon, iconFill, children }) => {


    return (
        <BoxStyled className="navbar-item">
            <Link to={linkTo}>
                {pathName.includes(linkTo.slice(0, 5)) ? iconFill : icon}
            </Link>
            {children}
        </BoxStyled>
    )
}

export default NavbarItem