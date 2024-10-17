import BoxStyled from "@shared/BoxStyled";
import Clickable from "@shared/Clickable";
import ListMenu from "@shared/ListMenu";
import React from "react";
import styles from "./comboMenuStyles";


const ComboMenu = ({ options, selectedOption, textContent, handleSelect }) => {

    const classes = styles();

    return (
        <BoxStyled className={classes.wrapper}>
            <ListMenu menuIcon={selectedOption.concat(" ").concat(textContent)}>
                {options.map((option, index) =>
                    <Clickable
                        key={index}
                        handleClick={() => handleSelect(option)}
                        alt={"option"}
                        text={option}
                    />
                )}
            </ListMenu>
        </BoxStyled>
    )
}

export default ComboMenu