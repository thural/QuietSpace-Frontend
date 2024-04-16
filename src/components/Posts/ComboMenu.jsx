import React, { useState } from "react";
import styles from "./styles/comboMenuStyles";
import { Box } from "@mantine/core";


const ComboMenu = ({ options, selectedOption, textContent, handleSelect }) => {

    const classes = styles();
    const [display, setDisplay] = useState('none');

    const toggleDisplay = () => {
        if (display === "none") setDisplay("block");
        else setDisplay("none");
    }

    return (
        <Box className={classes.comboWrapper}>
            <div onClick={toggleDisplay} className={classes.menu}>
                <p className="selected-option">{selectedOption.concat(" ").concat(textContent)}</p>
            </div>

            <div className={classes.menuOverlay} style={{ display }} onClick={() => setDisplay('none')}></div>

            <div onClick={() => setDisplay('none')} className={classes.menuList} style={{ display }}>

                {options.map(option => <div className="clickable" alt={"save post icon"}>
                    <p>{option}</p>
                </div>
                )}

            </div>
        </Box>
    )
}

export default ComboMenu