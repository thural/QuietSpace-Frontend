import React, { useState } from "react";
import Overlay from "../Overlay";
import styles from "./styles/signupStyles"
import { useDispatch } from "react-redux";

const SignupForm = () => {

  const dispatch = useDispatch()

  const classes = styles()
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
      .then(response => { console.log(response); dispatch({ type: 'loadUser', payload: { user: response } }) })
  }

  return (
    <>
      <Overlay />
      <div className={classes.signup}>
        <h1>Signup</h1>
        <form
          className='signup form'
          onSubmit={e => {
            handleSubmit(e)
            dispatch({ type: 'overlay' })
          }}>
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
        <button type='button' onClick={() => dispatch({ type: 'login' })}>login</button>
      </div>
    </>
  )
}

export default SignupForm