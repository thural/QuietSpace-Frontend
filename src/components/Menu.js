import React, { useState, useContext } from "react"
import styles from "../styles/menuStyles"
import HandlerContext from "./HandlersContext"
import PostsContext from "./PostsContext"


const Menu = ({ menu: items }) => {
	const { fetchUser } = useContext(HandlerContext)
	const { user } = useContext(PostsContext)
	const classes = styles();

	const [display, setDisplay] = useState('none');

	const toggleDisplay = () => {
		if (display === "none") setDisplay("block")
		else setDisplay("none");
	}

	const handleLogout = (event) => {
		event.preventDefault()
		fetch('http://localhost:5000/api/users/log-out', {
			method: 'GET'
		}).then(() => fetchUser())
	}

	return (
		<div style={{ display: user.username ? "block" : "none" }}>
			<div onClick={toggleDisplay} style={{cursor: 'pointer'}}>
				Menu
			</div>

			<div className={classes.menuOverlay} style={{ display: display }} onClick={toggleDisplay}></div>

			<div className={classes.menu} style={{ display: display }}>
				<h3>Menu</h3>

				<div className='items'>
					<h4>Saved</h4>
					<h4>Activity</h4>
					<h4>Settings</h4>
				</div>

				<div className='buttons'>
					<button onClick={handleLogout}>Log out</button>
				</div>
			</div>
		</div>
	);
};

export default Menu