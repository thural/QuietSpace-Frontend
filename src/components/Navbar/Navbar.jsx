import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles/navbarStyles";
import Menu from "./Menu";
import {
  PiBell,
  PiBellFill,
  PiChatCircle,
  PiHouse,
  PiMagnifyingGlass,
  PiUser,
  PiUserFill
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
          <Link to="/search"><PiMagnifyingGlass /></Link>
        </div>

        <div className="navbar-item">
          <Link to="/posts"><PiChatCircle /></Link>
        </div>

        <div className="navbar-item">
          <Link to="/profile"><PiUser /></Link>
        </div>

        <div className="navbar-item">
          <Link to="/notification"><PiBellFill /></Link>
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