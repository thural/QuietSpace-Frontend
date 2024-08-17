import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./styles/navbarStyles";
import Menu from "./Menu";
import {
  PiBell,
  PiBellFill,
  PiChatCircle,
  PiChatCircleFill,
  PiHouse,
  PiHouseFill,
  PiMagnifyingGlass,
  PiMagnifyingGlassFill,
  PiUser,
  PiUserFill
} from "react-icons/pi";




const NavBar = ({ children }) => {

  const pathName = useLocation().pathname;



  const classes = styles();

  return (
    <div className={classes.navbar}>
      <h1 className="title">QS</h1>
      <nav>
        <div className="navbar-item">
          <Link to="/posts">
            {pathName === "/posts" ? <PiHouseFill /> : <PiHouse />}
          </Link>
        </div>
        <div className="navbar-item">
          <Link to="/search">
            {pathName === "/search" ? <PiMagnifyingGlassFill /> : <PiMagnifyingGlass />}
          </Link>
        </div>
        <div className="navbar-item">
          <Link to="/chat">
            {pathName === "/chat" ? <PiChatCircleFill /> : <PiChatCircle />}
          </Link>
        </div>
        <div className="navbar-item">
          <Link to="/profile">
            {pathName === "/profile" ? <PiUserFill /> : <PiUser />}
          </Link>
        </div>
        <div className="navbar-item">
          <Link to="/notification/all">
            {pathName === "/notification/all" ? <PiBellFill /> : <PiBell />}
          </Link>
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