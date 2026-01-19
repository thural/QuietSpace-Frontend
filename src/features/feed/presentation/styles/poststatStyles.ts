import { createUseStyles, Theme } from "react-jss";

const useStyles = createUseStyles((theme: Theme) => ({
    postStats: {
        opacity: '0.75',
        marginLeft: "auto",
        gap: theme.spacing(theme.spacingFactor.ms),
    }
}));

export default useStyles