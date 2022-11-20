import React, { useContext, useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import PostsContext from "./PostsContext";
import Overlay from "./Overlay";

const useStyles = createUseStyles({
  login: {
    display: 'flex',
    flexFlow: 'column nowrap',
    backgroundColor: 'white',
    padding: '1rem',
    gap: '0.5rem',
    borderRadius: '1em',
    color: 'black',
    boxShadow: '4px 4px lightsteelblue',
    margin: 'auto',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    '& button': {
      marginTop: '1rem',
      width: 'fit-content',
      backgroundColor: 'black',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '1rem',
      border: '1px solid black',
      fontSize: '1rem',
      fontWeight: '500',
    },
    '& .input': {
      display: 'flex',
      flexFlow: 'column nowrap',
      gap: '0.5rem',
    },
    '& input': {
      boxSizing: 'border-box',
      width: '100%',
      padding: '10px',
      height: '1.8rem',
      backgroundColor: '#e2e8f0',
      border: '1px solid #e2e8f0',
      borderRadius: '10px'
    },
    '& input:focus': {
      outline: 'none',
      borderColor: '#a7abb1',
    }
  },
});

const LoginForm = ({ toggleComponent }) => {
  //const { posts: cards } = useContext(PostsContext);
  const classes = useStyles();
  const [formData, setFormData] = useState({ username:'', password:'' })

  useEffect(() => console.log(formData.username), [formData])

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  const handleSubmit = (event) => {
    alert(`A form was submitted: ${formData.username} ${formData.password}`);
    fetch('http://localhost:5000/log-in', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(formData)
    }).then(function (response) {
      console.log(response)
      return response.json();
    })
    event.preventDefault();
  }

  return (
    <>
      <Overlay toggleComponent={toggleComponent} />
      <div className={classes.login}>
        <h1>Login</h1>
        <form className='login form' onSubmit={handleSubmit}>
          <div className="login input">
            <input type='text' name='username' placeholder="username"
              value={formData.username} onChange={handleChange} />
            <input type='password' name='password' placeholder="password"
              value={formData.password} onChange={handleChange} />
          </div>
          <button type='submit'>Login</button>
        </form>
        <h3>don't have an account?</h3>
        <button type='button'>Signup</button>
      </div>
    </>
  )
}

export default LoginForm