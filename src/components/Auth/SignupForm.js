import React, { useContext, useState } from "react";
import MainContext from "../MainContext";
import Overlay from "../Overlay";
import styles from "./styles/signupStyles"

const SignupForm = () => {

	const classes = styles()
	const { setUser, setFormView } = useContext(MainContext)
	const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' })

	const handleChange = (event) => {
		const { name, value } = event.target
		setFormData({ ...formData, [name]: value });
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		fetch('http://localhost:5000/api/users/sign-up', {
			method: 'POST',
			headers: { 'Content-type': 'application/json' },
			body: JSON.stringify(formData)
		})
			.then(res => res.json(), err => console.log('error message: ', err))
			.then(response => {
				setUser(response)
			})
	}

	return (
		<>
			<Overlay />
			<div className={classes.signup}>
				<h1>Signup</h1>
				<form className='signup form' onSubmit={e => { handleSubmit(e); setFormView('overlay') }}>
					<div className="signup input">
						<input
							type='text'
							name='username'
							placeholder="username"
							value={formData.username}
							onChange={handleChange}
						/>
						<input
							type='password'
							name='password'
							placeholder="password"
							value={formData.password}
							onChange={handleChange}
						/>
						<input
							type='password'
							name='confirmPassword'
							placeholder="confirm password"
							value={formData.confirmPassword}
							onChange={handleChange}
						/>
					</div>
					<button type='submit'>submit</button>
				</form>
				<h3>already have an account?</h3>
				<button type='button' onClick={() => setFormView({formName:'login'})}>login</button>
			</div>
		</>
	)
}

export default SignupForm