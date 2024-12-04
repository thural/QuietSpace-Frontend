import { createUseStyles, Theme } from "react-jss";

const styles = createUseStyles((theme: Theme) => ({
    searchContainer: {

    },
    contacts: {
        display: 'flex',
        gridColumn: '1/2',
        position: 'relative',
        borderRight: '1px solid',
        flexFlow: 'column nowrap',
    },
    searchSection: {
        zIndex: theme.zIndex.tooltip
    },
    resultContainer: {
        width: '100%',
        display: 'none',
        minHeight: '16rem',
        position: 'absolute',
        boxSizing: 'border-box',
        flexDirection: 'column',
        zIndex: theme.zIndex.tooltip,
        boxShadow: theme.shadows.medium,
        backgroundColor: theme.colors.background,
        gap: theme.spacing(theme.spacingFactor.sm),
        padding: theme.spacing(theme.spacingFactor.xs),
        borderBottom: `1px solid ${theme.colors.backgroundSecondary}`,
    },
    recentQueries: {
        width: '100%',
        alignItems: 'center',
        boxSizing: 'border-box',
        justifyContent: 'space-between',
        padding: `0 ${theme.spacing(theme.spacingFactor.sm)}`,
    },
    queryCard: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    }
}));

export default styles
