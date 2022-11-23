import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import PostsContext from "./PostsContext";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import styles from "../styles/homeStyles"

const Home = () => {
  const { user } = useContext(PostsContext);
  const classes = styles();

  const [form, setForm] = useState({login:false, signup:false, overlay:false});

  const toggleComponent = (name) => {
    switch (name) {
      case "login":
        setForm({ login: !form.login, signup: false });
        break;
      case "signup":
        setForm({ signup: !form.signup, login: false });
        break;
      case "overlay":
        setForm({ signup: false, login: false });
        break;
        default:
        null;
    }
  }

  return (
    <>
      <div className={classes.wrapper}>
        <div className="home-text">
          <h3>Contribute to society by speaking your truth</h3>
          <h1>Free speech is the foundation of a healthy society</h1>
          {
            user.username ? <Link to="/posts"><button>Post now</button></Link> :
              <button onClick={() => toggleComponent('login')}>Login to post</button>
          }
        </div>
      </div>
      {
      form.signup ? <SignupForm toggleComponent={toggleComponent}/> :
      form.login ? <LoginForm toggleComponent={toggleComponent}/> :
      null
      }
    </>
  )
};

export default Home;