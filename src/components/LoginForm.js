import React, { useContext, useState } from "react";
import HandlerContext from "./HandlersContext";
import Overlay from "./Overlay";
import styles from "../styles/loginStyles"

const LoginForm = ({ toggleComponent }) => {
	//const { posts: cards } = useContext(PostsContext);
	//const { user } = useContext(PostsContext);
	const classes = styles();
	const { fetchUser } = useContext(HandlerContext);
	const [formData, setFormData] = useState({ username: '', password: '' })

	const handleChange = (event) => {
		setFormData({ ...formData, [event.target.name]: event.target.value });
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		fetch('http://localhost:5000/api/users/log-in', {
			method: 'POST',
			headers: { 'Content-type': 'application/json' },
			body: JSON.stringify(formData)
		}).then(function (res) {
			//console.log('LOGIN RESPONSE: ', res.json())
			fetchUser()
			//return res.json();
		})
	}

	return (
		<>
			<Overlay />
			<div className={classes.login}>
				<h1>Login</h1>
				<form className='login form' onSubmit={e => { handleSubmit(e); toggleComponent('overlay') }}>
					<div className="login input">
						<input type='text' name='username' placeholder="username"
							value={formData.username} onChange={handleChange} />
						<input type='password' name='password' placeholder="password"
							value={formData.password} onChange={handleChange} />
					</div>
					<button type='submit'>Login</button>
				</form>
				<h3>don't have an account?</h3>
				<button type='button' onClick={() => toggleComponent('signup')}>Signup</button>
			</div>
		</>
	)
}

export default LoginForm