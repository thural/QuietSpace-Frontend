import React from "react"
import styles from "./styles/contactStyles"

const Contact = () => {
	const classes = styles();

	return (
		<div className={classes.wrapper}>
			<div className="content">
				<h1>Quiet Space</h1>
				<h3>Tel: +263 111 22 33</h3>
				<h1>Hills drive 49, Zimbabwe</h1>
			</div>
		</div>
	);
};

export default Contact