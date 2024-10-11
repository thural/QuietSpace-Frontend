import React, { useState } from "react";
import styles from "./styles/comboMenuStyles";
import { Box } from "@mantine/core";
import Clickable from "../Shared/Clickable";
import ListMenu from "../Shared/ListMenu";


const ComboMenu = ({ options, selectedOption, textContent, handleSelect }) => {

    const classes = styles();

    return (
        <Box className={classes.comboWrapper}>
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
        </Box>
    )
}

export default ComboMenu