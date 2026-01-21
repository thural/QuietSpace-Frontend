import { createUseStyles } from "react-jss";
import { Theme } from "../../../../shared/types/theme";

const useStyles = createUseStyles((theme: Theme) => ({
    chatQuery: {
        width: '100%',
        margin: 'auto',
        display: 'flex',
        alignItems: 'center',
        height: 'fit-content',
        flexFlow: 'row nowrap',
        boxSizing: 'border-box',
        color: theme.colors.text,
        backgroundColor: theme.colors.backgroundTransparentMax,
        gap: theme.spacing(theme.spacingFactor.md),
        padding: theme.spacing(theme.spacingFactor.sm),
    },
}));

export default useStyles