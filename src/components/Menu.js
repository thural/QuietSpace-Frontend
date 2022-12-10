import React, { useState, useContext } from "react"
import cartImg from '../assets/cart.svg'
import styles from "../styles/menuStyles"
import HandlerContext from "./HandlersContext"


const Menu = ({ menu: items }) => {
	const { fetchUser } = useContext(HandlerContext);
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

	// const countItems = (items) => {
	// 	const count = items
	// 		.reduce((sum, { count }) => sum + count, 0);
	// 	return String(count)
	// };

	// const calcTotal = (items) => {
	// 	const total = items
	// 		.reduce((sum, { price, count }) => sum + (price * count), 0);
	// 	return String(Math.ceil(total * 10) / 10)
	// };

	return (
		<>
			<div className={classes.cartBtn} onClick={toggleDisplay}>
				<img src={cartImg} ></img>
				{/* <div className={classes.cartBadge}>{countItems(items)}</div> */}
			</div>

			<div className={classes.cartBckg} style={{ display: display }} onClick={toggleDisplay}></div>

			<div className={classes.cart} style={{ display: display }}>
				<h3>Menu</h3>

				<div className='items'>
					<h4>Saved</h4>
					<h4>Activity</h4>
					<h4>Settings</h4>
				</div>

				{/* <h3>total: ${calcTotal(items)}</h3> */}

				<div className='buttons'>
					<button onClick={handleLogout}>Log out</button>
				</div>
			</div>
		</>
	);
};

export default Menu