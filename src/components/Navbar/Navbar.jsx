import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles/navbarStyles";
import Menu from "./Menu";
import postsIcon from "../../assets/compass-line.svg";
import chatIcon from "../../assets/chat-line.svg";
import contactIcon from "../../assets/question-circle-line.svg";
import { useQueryClient } from "@tanstack/react-query";


const NavBar = ({ children }) => {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData("user");
  const classes = styles();
  
  return (
    <div className={classes.navbar}>
      <h1>Quiet Space</h1>

      <nav>
        <div className="navbar-item">
          <Link to="/posts"><img src={postsIcon} /></Link>
        </div>

        {
          user?.username &&
          <div className="navbar-item">
            <Link to="/chat"><img src={chatIcon} /></Link>
          </div>
        }

        <div className="navbar-item">
          <Link to="/contact"><img src={contactIcon} /></Link>
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