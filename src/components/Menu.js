import React, { useState, useContext } from "react";
import { createUseStyles } from "react-jss";
import cartImg from '../assets/cart.svg';
import HandlerContext from "./HandlersContext";
import styles from "../styles/menuStyles"

const Cart = ({ menu: items }) => {
	const handleCart = useContext(HandlerContext)
	const classes = styles();

	const [display, setDisplay] = useState('none');

	const toggleDisplay = () => {
		if (display === "none") setDisplay("grid")
		else setDisplay("none");
	};

	const countItems = (items) => {
		const count = items
			.reduce((sum, { count }) => sum + count, 0);
		return String(count)
	};

	const calcTotal = (items) => {
		const total = items
			.reduce((sum, { price, count }) => sum + (price * count), 0);
		return String(Math.ceil(total * 10) / 10)
	};

	return (
		<>
			<div className={classes.cartBtn} onClick={toggleDisplay}>
				<img src={cartImg} ></img>
				<div className={classes.cartBadge}>{countItems(items)}</div>
			</div>
			<div className={classes.cartBckg} style={{ display: display }} onClick={toggleDisplay}></div>
			<div className={classes.cart} style={{ display: display }}>
				<h3>Shopping Cart</h3>
				<div className='items'>
					{items.map(({ id, image, title, count, price }) => (
						<div key={id} className='item'>
							<div className="image"><img src={image} /></div>
							<div className='details'>
								<h5>{title}</h5>
								<p>${(price * count)}</p>
								<div className='counter'>
									<button onClick={() => handleCart({ id, type: 'decrement', count })}>-</button>
									<p>{count}</p>
									<button onClick={() => handleCart({ id, type: 'increment' })}>+</button>
								</div>
							</div>
						</div>
					))}
				</div>
				<h3>total: ${calcTotal(items)}</h3>
				<div className='buttons'>
					<button>checkout</button>
					<button onClick={toggleDisplay}>close</button>
				</div>
			</div>
		</>
	);
};

export default Cart;