import React, { useContext, useState } from "react"
import HandlerContext from "../MainContext"
import Overlay from "../Overlay"
import styles from "./styles/loginStyles"
import { useDispatch } from "react-redux"
import { overlay, signup } from "../../redux/formViewReducer"

const LoginForm = () => {

  const dispatch = useDispatch()
  const classes = styles()

  const { fetchUser, fetchPosts, fetchChat } = useContext(HandlerContext)
  const [formData, setFormData] = useState({ username: '', password: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    fetch('http://localhost:5000/api/users/log-in', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(formData)
    }).then(() => fetchUser().then(fetchPosts(), fetchChat()))
  }

  return (
    <>
      <Overlay />
      <div className={classes.login}>
        <h1>Login</h1>
        <form
          className='login form'
          onSubmit={e => {
            handleSubmit(e)
            dispatch(overlay())
          }}>

          <div className="login input">
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
          </div>
          <button type='submit'>login</button>
        </form>
        <h3>don't have an account?</h3>
        <button type='button' onClick={() => dispatch(signup())}>signup</button>
      </div>
    </>
  )
}

export default LoginForm