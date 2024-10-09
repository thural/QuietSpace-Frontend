import React, { useState } from "react";
import styles from "./styles/comboMenuStyles";
import { Box } from "@mantine/core";


const ComboMenu = ({ options, selectedOption, textContent, handleSelect }) => {

    const classes = styles();

    const [display, setDisplay] = useState('none');

    const toggleDisplay = () => {
        setDisplay(display === "none" ? "block" : "none");
    }

    const handleClick = (option) => {
        handleSelect(option);
        setDisplay('none');
    }

    const MenuList = ({ options, display }) => (
        <div className={classes.menuList} style={{ display }}>
            {options.map((option, index) =>
                <div
                    key={index}
                    onClick={() => handleClick(option)}
                    className="clickable"
                    alt={"option"}>
                    <p>{option}</p>
                </div>
            )}
        </div>
    );

    const MenuToggle = ({ toggleDisplay, option }) => (
        <div onClick={toggleDisplay} className={classes.menu}>
            <p className="selected-option">{option.concat(" ").concat(textContent)}</p>
        </div>
    );

    const Overlay = ({ display, setDisplay }) => (
        <div className={classes.menuOverlay} style={{ display }} onClick={() => setDisplay('none')} />
    );

    return (
        <Box className={classes.comboWrapper}>
            <MenuToggle toggleDisplay={toggleDisplay} option={selectedOption} />
            <Overlay display={display} setDisplay={setDisplay} />
            <MenuList options={options} display={display} />
        </Box>
    )
}

export default ComboMenu