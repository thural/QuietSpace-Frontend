import React from "react"
import logo from "../../assets/github-svgrepo-com.svg"
import styles from "./styles/contactStyles"

const Contact = () => {

  const classes = styles();

  return (
    <div className={classes.wrapper}>

      <div className={classes.content}>
        <h1 className="brand">Quiet Space</h1>
        <h3 className="email">tural.musaibov@outlook.com</h3>
        <h1 className="location">Baku, Azerbaijan</h1>
      </div>

      <div className={classes.footer}>
        <a href='https://github.com/thural'>
          <p>Copyright © 2022 thural</p>
          <img src={logo}></img>
        </a>
      </div>

    </div>
  )
}

export default Contact