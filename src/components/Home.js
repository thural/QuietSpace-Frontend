import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import PostsContext from "./PostsContext";
import HandlerContext from "./HandlersContext";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import styles from "../styles/homeStyles"

const Home = () => {
	const { user, formView } = useContext(PostsContext);
	const { toggleComponent } = useContext(HandlerContext);
	const classes = styles();

	return (
		<>
			<div className={classes.wrapper}>
				<div className="home-text">
					<h3>Contribute to society by speaking your truth</h3>
					<h1>Free speech is the foundation of a healthy society</h1>
					{
						user.username ? <Link to="/posts"><button>Post now</button></Link> :
							<button onClick={() => toggleComponent('login')}>Login to post</button>
					}
				</div>
			</div>
			{
				formView.signup ? <SignupForm toggleComponent={toggleComponent} /> :
					formView.login ? <LoginForm toggleComponent={toggleComponent} /> :
						null
			}
		</>
	)
};

export default Home;