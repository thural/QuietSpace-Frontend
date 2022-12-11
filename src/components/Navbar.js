import React from "react"
import { Link } from "react-router-dom"
import styles from "../styles/navbarStyles"
import Menu from "./Menu"


const NavBar = ({ children }) => {

	const classes = styles();

	return (
		<div className={classes.navbar}>
			<h1>Quiet Space</h1>
			<nav>
				<ul>
					<Link to="/"><li>Home</li></Link>
					<Link to="/posts"><li>Posts</li></Link>
					<Link to="/contact"><li>Contact</li></Link>
					<Menu />
				</ul>
				{children}
			</nav>

		</div>
	)
};

export default NavBar;