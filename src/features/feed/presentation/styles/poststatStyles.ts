import { createUseStyles } from "react-jss";
import { Theme } from "../../../../shared/types/theme";

const useStyles = createUseStyles((theme: Theme) => ({
    postStats: {
        opacity: '0.75',
        marginLeft: "auto",
        gap: theme.spacing(theme.spacingFactor.ms),
    }
}));

export default useStyles