import React from "react"
import classes from "./Button.module.css"

const Button = ({ content, type = "button" }) => {

    return (
        <button className={classes[`${type}`]}>
            {content}
        </button>
    )
}

export default Button