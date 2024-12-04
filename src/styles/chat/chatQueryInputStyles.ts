import { createUseStyles, Theme } from "react-jss";

const useStyles = createUseStyles((theme: Theme) => ({
    inputStyled: {
        width: '100%',
        margin: 'auto',
        display: 'flex',
        alignItems: 'center',
        height: 'fit-content',
        flexFlow: 'row nowrap',
        boxSizing: 'border-box',
        color: theme.colors.text,
        backgroundColor: theme.colors.backgroundTransparent,
        gap: theme.spacing(theme.spacingFactor.md),
        padding: theme.spacing(theme.spacingFactor.sm),
    },
}));

export default useStyles