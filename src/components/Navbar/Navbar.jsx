import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles/navbarStyles";
import Menu from "./Menu";
import { RiChat3Line, RiHome5Line, RiSearch2Line } from "react-icons/ri";
import { RiHomeFill } from "react-icons/ri";
import { IoPersonOutline } from "react-icons/io5";
import { PiBell, PiChatCircle, PiChatCircleBold, PiHouseFill, PiMagnifyingGlass, PiMagnifyingGlassBold, PiUser } from "react-icons/pi";






const NavBar = ({ children }) => {
  const classes = styles();

  return (
    <div className={classes.navbar}>
      <h1>QS</h1>

      <nav>
        <div className="navbar-item">
          <Link to="/posts"><PiHouseFill /></Link>
        </div>

        <div className="navbar-item">
          <Link to="/posts"><PiMagnifyingGlassBold /></Link>
        </div>

        <div className="navbar-item">
          <Link to="/chat"><PiChatCircleBold /></Link>
        </div>

        <div className="navbar-item">
          <Link to="/contact"><PiUser /></Link>
        </div>

        <div className="navbar-item">
          <Link to="/contact"><PiBell /></Link>
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