import { createUseStyles } from "react-jss";
import { Theme } from "@shared/types/theme";

const styles = createUseStyles((theme: Theme) => ({
    resultContainer: {
        width: '100%',
        height: '50vh',
        display: 'none',
        boxSizing: 'border-box',
        zIndex: theme.zIndex.modal,
        borderRadius: theme.radius.md,
        boxShadow: theme.shadows.paper,
        backgroundColor: theme.colors.background,
        padding: theme.spacing(theme.spacingFactor.md),
        borderBottom: `.1px solid ${theme.colors.border}`,
    }

}));

export default styles