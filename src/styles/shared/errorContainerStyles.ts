import { createUseStyles, Theme } from "react-jss";

const styles = createUseStyles((theme: Theme) => (
    {
        container: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            backgroundColor: theme.colors.backgroundSecondary,
            color: theme.colors.textSecondary,
            border: `1px solid ${theme.colors.backgroundSecondary}`,
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
    }
));

export default styles