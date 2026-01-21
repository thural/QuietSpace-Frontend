import { createUseStyles } from "react-jss";
import { Theme } from "../../../../shared/types/theme";

const useStyles = createUseStyles((theme: Theme) => ({
    titleInput: {
        width: '100%',
        border: 'none',
        height: theme.spacing(1.8),
        boxSizing: 'border-box',
        fontWeight: theme.typography.fontWeightBold,
        marginBottom: theme.spacing(theme.spacingFactor.sm),
        backgroundColor: theme.colors.background,

        '&:focus': {
            outline: 'none',
            borderColor: theme.colors.border,
        },
    },
}));

export default useStyles