import React, { useState } from "react";
import Overlay from "../Overlay";
import styles from "./styles/signupStyles"
import { useDispatch } from "react-redux";
import { login, overlay } from "../../redux/formViewReducer";
import { fetchSignup } from "../../api/requestMethods";
import { SIGNUP_URL } from "../../constants/ApiPath";

const SignupForm = () => {

  const dispatch = useDispatch()

  const classes = styles()
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value });
  }

  const handleSubmit = async (event) => {
    const { password, confirmPassword } = formData;
    if (password !== confirmPassword) alert("passwords dooes not match, try again!")
    else {
      delete formData["confirmPassword"];
      event.preventDefault();
      const authResponse = await fetchSignup(SIGNUP_URL, formData);
      dispatch(loadAuth(authResponse));
      console.log(authResponse);
    }
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
            dispatch(overlay())
          }}>
          <div className="signup input">
            <input
              type='text'
              name='email'
              placeholder="email"
              value={formData.email}
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
          <button type='button' onClick={handleSubmit}>submit</button>
        </form>
        <h3>already have an account?</h3>
        <button type='button' onClick={() => dispatch(login())}>login</button>
      </div>
    </>
  )
}

export default SignupForm