import React from "react"
import logo from "../assets/github-svgrepo-com.svg"
import styles from "../styles/copyrightStyles"

const Copyright = () => {
	const classes = styles();

	return (
		<a href='https://github.com/thural' className={classes.wrapper}>
			<p>Copyright © 2022 thural</p>
			<img src={logo}></img>
		</a>
	);
};

export default Copyright;