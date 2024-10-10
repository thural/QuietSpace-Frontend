import { Link } from "react-router-dom"

const NavbarItem = ({ linkTo, pathName, icon, iconFill, children }) => {


    return (
        <div className="navbar-item">
            <Link to={linkTo}>
                {pathName === linkTo ? iconFill : icon}
            </Link>
            {children}
        </div>
    )
}

export default NavbarItem