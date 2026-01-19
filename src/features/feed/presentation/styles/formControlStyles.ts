import { createUseStyles, Theme } from "react-jss";


export const useStyles = createUseStyles((theme: Theme) => (
    {
        button: {
            display: 'block',
            marginLeft: 'auto',
            padding: `0 ${theme.spacing(theme.spacingFactor.lg)}`,
            fontSize: theme.typography.fontSize.primary,
            fontWeight: theme.typography.fontWeightBold,
            borderRadius: theme.radius.lg,
        },
        controlArea: {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(theme.spacingFactor.lg),
            '& svg': {
                fontSize: theme.typography.fontSize.secondary
            },
        },
        '@media (max-width: 720px)': {
            controlArea: {
                marginTop: 'auto'
            },
        }
    }
));

export default useStyles