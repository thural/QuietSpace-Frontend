import React, { useContext } from "react";
import { Link } from "react-router-dom";
import HandlerContext from "./HandlerContext";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import styles from "../styles/homeStyles"

const Home = () => {
	const { loggedUser, formView, setFormView } = useContext(HandlerContext);
	const classes = styles();

	return (
		<>
			<div className={classes.home}>
				<div className="home-text">
					<h1>Social media without the distraction</h1>
					<h3>Free speech is the foundation of a healthy society</h3>
				</div>
				{
					loggedUser.username ? <Link to="/posts"><button>Post now</button></Link> :
						<button onClick={() => setFormView({ formName: 'login' })}>Login to post</button>
				}
			</div>
			{
				formView.signup ? <SignupForm /> :
					formView.login ? <LoginForm /> :
						null
			}
		</>
	)
};

export default Home;