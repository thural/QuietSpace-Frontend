import { createUseStyles, Theme } from "react-jss";

const useStyles = createUseStyles((theme: Theme) => ({
    input: {
        boxSizing: 'border-box',
        width: '100%',
        padding: theme.spacing(theme.spacingFactor.ms),
        height: '2rem',
        backgroundColor: theme.colors.backgroundSecondary,
        border: '1px solid #e2e8f0',
        outline: 'none',
        borderRadius: theme.radius.sm,
        '& .prompt': {
            fontWeight: theme.typography.fontWeightRegular,
            fontSize: '1.1rem'
        },
        '&:focus': {
            outline: 'none',
            borderColor: theme.colors.borderExtra,
        },
    },
}));

export default useStyles