import { createUseStyles, Theme } from "react-jss";

const styles = createUseStyles((theme: Theme) => ({
    followSection: {
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: theme.typography.fontSize.large,
        margin: `${theme.spacing(theme.spacingFactor.xl)} 0`,
        '& .signout-icon': {
            padding: '0',
            width: '2.5rem',
            height: '2.5rem',
            display: 'flex',
            boxSizing: 'border-box',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: theme.radius.round,
            backgroundColor: theme.colors.backgroundSecondary
        }
    },

}))

export default styles