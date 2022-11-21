import Overlay from "./Overlay";
import styles from "../styles/signupStyles"

const SignupForm = ({ toggleComponent }) => {
const classes = styles();

  return (
    <>
      <Overlay toggleComponent={toggleComponent}/>
      <div className={classes.signup}>
        <h1>Sign Up</h1>
        <form className='signup form' method='POST' action='/log-in'>
          <div className="signup input">
            <input type='text' name='username' placeholder="username"></input>
            <input type='password' name='password' placeholder="password"></input>
            <input type='password' name='confirmPassword' placeholder="confirm password"></input>
          </div>
          <button type='submit' onClick={() => toggleComponent('signup')}>Submit</button>
        </form>
      </div>
    </>
  )
}

export default SignupForm