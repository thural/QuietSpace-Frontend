import { createUseStyles } from "react-jss";
import { Theme } from "../types/theme";

const useStyles = createUseStyles((theme: Theme) => ({
    baseCard: {
        alignItems: "center",
        background: theme.colors.inputField,
        padding: ".5rem",
        borderRadius: theme.radius.lg,
    }
}));

export default useStyles