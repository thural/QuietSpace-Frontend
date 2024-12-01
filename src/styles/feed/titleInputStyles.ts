import { createUseStyles, Theme } from "react-jss";

const useStyles = createUseStyles((theme: Theme) => ({
    titleInput: {
        width: '100%',
        border: 'none',
        height: '1.8rem',
        boxSizing: 'border-box',
        fontWeight: theme.typography.fontWeightBold,
        marginBottom: theme.spacing(theme.spacingFactor.sm),

        '&:focus': {
            outline: 'none',
            borderColor: theme.colors.border,
        },
    },
}));

export default useStyles