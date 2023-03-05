import React, { useContext } from "react"
import { Link } from "react-router-dom"
import MainContext from "../MainContext"
import SignupForm from "../Auth/SignupForm"
import LoginForm from "../Auth/LoginForm"
import styles from "./styles/homeStyles"

const Home = () => {
  const classes = styles()
  const { loggedUser, formView, setFormView } = useContext(MainContext)

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
}

export default Home