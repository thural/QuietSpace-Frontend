import { createUseStyles } from "react-jss";
import { Theme } from "../types/theme";

const styles = createUseStyles((theme: Theme) => (
    {
        container: {
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            boxSizing: "border-box",
            justifyContent: "center",
            padding: theme.spacing(theme.spacingFactor.lg),
            backgroundColor: theme.colors.backgroundSecondary,
            color: theme.colors.textSecondary,
            border: `1px solid ${theme.colors.backgroundSecondary}`,
            borderRadius: theme.radius.xs,
            gap: theme.spacing(theme.spacingFactor.md * 5),
            "& svg": {
                fontSize: "3rem",
                margin: theme.spacing(theme.spacingFactor.md)
            }
        }
    }
));

export default styles