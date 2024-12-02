import { createUseStyles, Theme } from "react-jss";

const styles = createUseStyles((theme: Theme) => ({

    notificationCard: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        borderBottom: ".1rem solid #e3e3e3",
        padding: `${theme.spacing(theme.spacingFactor.sm)} 0`,

        '& button': {
            height: '2rem',
            width: '8rem',
            cursor: 'pointer',
            display: 'block',
            marginLeft: 'auto',
            color: theme.colors.textMax,
            border: `1px solid ${theme.colors.buttonBorder}`,
            padding: `0 ${theme.spacing(theme.spacingFactor.md)}`,
            fontSize: theme.spacing(0.9),
            fontWeight: theme.typography.fontWeightBold,
            borderRadius: theme.radius.ms,
            backgroundColor: theme.colors.backgroundSecondary
        },
    },
}));

export default styles