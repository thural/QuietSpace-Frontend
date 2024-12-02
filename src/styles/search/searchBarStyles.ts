import { createUseStyles, Theme } from "react-jss";

const styles = createUseStyles((theme: Theme) => ({

    searchbar: {
        display: 'flex',
        margin: `${theme.spacing(theme.spacingFactor.md)} 0`,
        position: 'relative',
        minWidth: '320px',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${theme.colors.borderExtra}`,
        borderRadius: theme.radius.xl,
        backgroundColor: theme.colors.background,
    },

    searchbarSecondary: {
        display: 'flex',
        margin: `${theme.spacing(theme.spacingFactor.md)} 0`,
        position: 'relative',
        minWidth: '320px',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${theme.colors.borderExtra}`,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.background,
    },

    searchInput: {
        outline: '0',
        width: "100%",
        minWidth: '360px',
        fontSize: theme.typography.fontSize.primary,
        padding: `${theme.spacing(theme.spacingFactor.sm)} 0`,
    },

    searchIcon: {
        margin: `0 ${theme.spacing(theme.spacingFactor.md)}`,
        fontSize: theme.typography.fontSize.large,
        color: theme.colors.borderExtra
    },

    searchIconLarge: {
        fontSize: '2rem',
        margin: `0 ${theme.spacing(theme.spacingFactor.md)}`,
        color: theme.colors.borderExtra
    }
}));

export default styles