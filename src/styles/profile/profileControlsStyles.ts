import { createUseStyles, Theme } from "react-jss";

const styles = createUseStyles((theme: Theme) => ({
    profileControlsSection: {
        '& button': {
            borderColor: theme.colors.borderExtra,
            color: theme.colors.text
        },
    },
}));

export default styles