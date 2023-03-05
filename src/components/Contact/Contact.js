import React from "react"
import logo from "../../assets/github-svgrepo-com.svg"
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

			<div className={classes.footer}>
				<a href='https://github.com/thural'>
					<p>Copyright © 2022 thural</p>
					<img src={logo}></img>
				</a>
			</div>

		</div>
	)
}

export default Contact