import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles/navbarStyles";
import Menu from "./Menu";
import { RiChat3Line, RiHome5Line, RiSearch2Line } from "react-icons/ri";
import { RiHomeFill } from "react-icons/ri";
import { IoPersonOutline } from "react-icons/io5";






const NavBar = ({ children }) => {
  const classes = styles();

  return (
    <div className={classes.navbar}>
      <h1>QS</h1>

      <nav>
        <div className="navbar-item">
          <Link to="/posts"><RiHomeFill /></Link>
        </div>

        <div className="navbar-item">
          <Link to="/posts"><RiSearch2Line /></Link>
        </div>

        <div className="navbar-item">
          <Link to="/chat"><RiChat3Line /></Link>
        </div>

        <div className="navbar-item">
          <Link to="/contact"><IoPersonOutline/></Link>
        </div>

        {children}
      </nav>

      <div className="navbar-item menu">
        <Menu />
      </div>

    </div>
  )
}

export default NavBar