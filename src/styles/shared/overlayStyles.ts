import { createUseStyles, Theme } from "react-jss"

const styles = createUseStyles((theme: Theme) => ({

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

    // overlay: {
    //     position: "fixed",
    //     top: "0",
    //     left: "0",
    //     width: "100 %",
    //     height: "100 %",
    //     background: "rgba(0, 0, 0, 0.5)",
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    // },

    overlayContent: {
        background: theme.colors.background,
        padding: theme.spacing(theme.spacingFactor.md),
        borderRadius: theme.radius.xs,
        position: "relative",
    },

    closeButton: {
        position: "absolute",
        top: theme.spacing(0.6),
        right: theme.spacing(0.6),
        background: "none",
        border: "none",
        fontSize: theme.typography.fontSize.primary,
        cursor: "pointer",
    }

}))

export default styles