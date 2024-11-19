import { createUseStyles } from "react-jss";

const styles = createUseStyles({
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#f8d7da",
        color: "#721c24",
        border: "1px solid #f5c6cb",
        borderRadius: "4px",
        padding: "20px",
        boxSizing: "border-box",
        flexDirection: "row",
        gap: "5rem'",
        "& svg": {
            fontSize: "3rem",
            margin: "1rem"
        }
    }
});

export default styles