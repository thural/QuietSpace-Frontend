import { createUseStyles, Theme } from "react-jss";

const styles = createUseStyles((theme: Theme) => ({
    userCard: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        margin: `${theme.spacing(theme.spacingFactor.sm)} 0`,
        '& button': {
            color: theme.colors.textMax,
            width: '8rem',
            height: '2rem',
            display: 'block',
            cursor: 'pointer',
            marginLeft: 'auto',
            border: '1px solid #afafaf',
            borderRadius: theme.radius.ms,
            backgroundColor: theme.colors.background,
            fontSize: theme.typography.fontSize.small,
            fontWeight: theme.typography.fontWeightRegular,
            padding: `0 ${theme.spacing(theme.spacingFactor.md)}`,
        },
    }
}));

export default styles