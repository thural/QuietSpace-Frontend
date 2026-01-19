import { createUseStyles, Theme } from "react-jss";

const useStyles = createUseStyles((theme: Theme) => ({
    statsSection: {
        alignItems: 'center',
        height: theme.spacing(theme.spacingFactor.md),
        gap: theme.spacing(theme.spacingFactor.sm),
        fontSize: theme.typography.fontSize.secondary,
        margin: `${theme.spacing(theme.spacingFactor.md)} 0`
    }
}));

export default useStyles