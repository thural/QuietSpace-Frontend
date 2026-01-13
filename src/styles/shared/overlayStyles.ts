import { createUseStyles, Theme } from "react-jss"

const styles = createUseStyles((theme: Theme) => ({
    overlayWrapper: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 3,
    },

    overlay: {
        top: '0',
        left: '0',
        zIndex: '3',
        width: '100%',
        height: '100%',
        display: 'block',
        position: 'fixed',
        backdropFilter: 'blur(32px)',
        backgroundColor: 'rgba(128, 128, 128, 0.1)'
    },

    overlayContent: {
        position: "relative",
        borderRadius: theme.radius.xs,
        background: theme.colors.background,
        padding: theme.spacing(theme.spacingFactor.md),
    },

    closeButton: {
        border: "none",
        cursor: "pointer",
        background: "none",
        position: "absolute",
        fontSize: theme.typography.fontSize.primary,
        top: theme.spacing(theme.spacingFactor.md * 0.6),
        right: theme.spacing(theme.spacingFactor.md * 0.6),
    }

}));

export default styles