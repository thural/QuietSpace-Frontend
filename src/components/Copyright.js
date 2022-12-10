import React from "react"
import logo from "../assets/github-svgrepo-com.svg"
import styles from "../styles/copyrightStyles"

const Copyright = () => {
	const classes = styles();

	return (
		<div className={classes.footer}>
			<a href='https://github.com/thural'>
				<p>Copyright © 2022 thural</p>
				<img src={logo}></img>
			</a>
		</div>
	);
};

export default Copyright