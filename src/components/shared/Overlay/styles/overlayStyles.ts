import { createUseStyles } from "react-jss"

const styles = createUseStyles({

    overlay: {
        top: '0',
        left: '0',
        zIndex: '3',
        width: '100%',
        height: '100%',
        display: 'block',
        position: 'fixed',
        backdropFilter: 'blur(32px)',
        backgroundColor: 'rgba(128, 128, 128, 0.1)'
    },

    // overlay: {
    //     position: "fixed",
    //     top: "0",
    //     left: "0",
    //     width: "100 %",
    //     height: "100 %",
    //     background: "rgba(0, 0, 0, 0.5)",
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    // },

    overlayContent: {
        background: "white",
        padding: "20px",
        borderRadius: "5px",
        position: "relative",
    },

    closeButton: {
        position: "absolute",
        top: "10px",
        right: "10px",
        background: "none",
        border: "none",
        fontSize: "20px",
        cursor: "pointer",
    }

})

export default styles