import { Link } from "react-router-dom"
import BoxStyled from "../Shared/BoxStyled"

const NavbarItem = ({ linkTo, pathName, icon, iconFill, children }) => {


    return (
        <BoxStyled className="navbar-item">
            <Link to={linkTo}>
                {pathName === linkTo ? iconFill : icon}
            </Link>
            {children}
        </BoxStyled>
    )
}

export default NavbarItem