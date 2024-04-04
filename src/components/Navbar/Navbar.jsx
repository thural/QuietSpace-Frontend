import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles/navbarStyles";
import Menu from "./Menu";
import {
  PiBell,
  PiChatCircle,
  PiHouse,
  PiMagnifyingGlassFill,
  PiUser
} from "react-icons/pi";




const NavBar = ({ children }) => {
  const classes = styles();

  return (
    <div className={classes.navbar}>
      <h1>QS</h1>

      <nav>
        <div className="navbar-item">
          <Link to="/posts"><PiHouse /></Link>
        </div>

        <div className="navbar-item">
          <Link to="/search"><PiMagnifyingGlassFill /></Link>
        </div>

        <div className="navbar-item">
          <Link to="/posts"><PiChatCircle /></Link>
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