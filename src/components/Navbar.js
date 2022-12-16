import React, { useContext } from "react"
import { Link } from "react-router-dom"
import styles from "../styles/navbarStyles"
import Menu from "./Menu"
import PostsContext from "./PostsContext"


const NavBar = ({ children }) => {

	const { user } = useContext(PostsContext)

	const classes = styles();

	return (
		<div className={classes.navbar}>
			<h1>Quiet Space</h1>
			<nav>
				<ul>
					<Link to="/"><li>Home</li></Link>
					<Link to="/posts"><li>Posts</li></Link>
					{
						user.username && <Link to="/chat"><li>Chat</li></Link>
					}
					<Link to="/contact"><li>Contact</li></Link>
					<Menu />
				</ul>
				{children}
			</nav>

		</div>
	)
}

export default NavBar