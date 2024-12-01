import { createUseStyles, Theme } from "react-jss"

const styles = createUseStyles((theme: Theme) => (
    {
        menu: {
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            cursor: 'pointer',
            margin: '0',
            padding: '0'
        },
        menuOverlay: {
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            display: 'none',
            zIndex: '0',
            position: 'fixed',
            width: '100vw',
            height: '100vh'
        },
        menuList: {
            margin: '0',
            display: 'none',
            position: 'relative',
            boxSizing: 'border-box',
            color: theme.colors.textMax,
            width: theme.spacing(theme.spacingFactor.md * 9),
            border: `1px solid ${theme.colors.borderSecondary}`,
            bottom: theme.spacing(theme.spacingFactor.md * 2),
            padding: theme.spacing(theme.spacingFactor.sm),
            boxShadow: theme.shadows.light,
            borderRadius: theme.radius.md,
            backgroundColor: theme.colors.backgroundMax,
            '& .clickable:hover': {
                margin: '0rem',
                background: theme.colors.backgroundSecondary,
                borderRadius: theme.radius.sm,
                padding: theme.spacing(theme.spacingFactor.sm),
                boxSizing: 'border-box'
            },
            '& .clickable': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: theme.spacing(theme.spacingFactor.sm),
                fontSize: theme.typography.fontSize.secondary,
            },
            '& a, a:hover, a:focus, a:active': {
                textDecoration: 'none',
                color: 'inherit',
            },
            '& p': {
                margin: '0',
                padding: '0',
                alignSelf: 'center',
                lineHeight: '0',
                fontWeight: theme.typography.fontWeightRegular,
            }
        }
    }
));


export default styles