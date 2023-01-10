import React, { useState, useContext } from "react"
import styles from "../styles/menuStyles"
import HandlerContext from "./HandlerContext"
import savedIcon from "../assets/bookmark.svg"
import historyIcon from "../assets/history.svg"
import settingsIcon from "../assets/settings.svg"
import logoutIcon from "../assets/log-out.svg"



const Menu = ({ menu: items }) => {
	const { user, fetchUser } = useContext(HandlerContext)
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
			<div onClick={toggleDisplay} style={{ cursor: 'pointer' }}>
				Menu
			</div>

			<div className={classes.menuOverlay} style={{ display: display }} onClick={toggleDisplay}></div>

			<div className={classes.menu} style={{ display: display }}>
				<div className="menu-item"><p>Saved</p><img src={savedIcon} /></div>
				<div className="menu-item"><p>Activity</p><img src={historyIcon} /></div>
				<div className="menu-item"><p>Settings</p><img src={settingsIcon} /></div>
				<div className="menu-item" onClick={handleLogout}><p>Logout</p><img src={logoutIcon} /></div>
			</div>
		</div>
	);
};

export default Menu