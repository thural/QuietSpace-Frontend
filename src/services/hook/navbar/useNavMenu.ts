import { useState } from "react";

const useNavMenu = () => {
    const [display, setDisplay] = useState("none");

    const toggleDisplay = () => {
        if (display === "none") setDisplay("block");
        else setDisplay("none");
    }

    const hideMenu = () => {
        setDisplay("none")
    }

    return {
        display,
        setDisplay,
        toggleDisplay,
        hideMenu
    }
}

export default useNavMenu