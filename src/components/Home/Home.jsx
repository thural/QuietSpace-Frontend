import React from "react"
import { Link } from "react-router-dom"
import SignupForm from "../Auth/SignupForm"
import LoginForm from "../Auth/LoginForm"
import styles from "./styles/homeStyles"
import { useDispatch, useSelector } from "react-redux"
import { login } from "../../redux/formViewReducer"

const Home = () => {
  const dispatch = useDispatch()
  const formView = useSelector(state => state.formViewReducer)
  const user = useSelector(state => state.userReducer)

  const classes = styles()

  return (
    <>
      <div className={classes.home}>
        <div className="home-text">
          <h1>Social media without the distraction</h1>
          <h3>Free speech is the foundation of a healthy society</h3>
        </div>
        {
          user?.username ? <Link to="/posts"><button>Post now</button></Link> :
            <button onClick={() => dispatch(login())}>Login to post</button>
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