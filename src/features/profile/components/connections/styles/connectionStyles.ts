import { createUseStyles } from "react-jss";
import { Theme } from "../../../../../shared/types/theme";

const styles = createUseStyles((theme: Theme) => ({
    container: {
        paddingTop: theme.spacing(theme.spacingFactor.ms * 2.5),
        top: '50%',
        left: '50%',
        color: theme.colors.text,
        height: '50vh',
        margin: 'auto',
        display: 'block',
        position: 'fixed',
        flexFlow: 'row nowrap',
        transform: 'translate(-50%, -50%)',
        zIndex: theme.zIndex.modal,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.background,
        gap: theme.spacing(theme.spacingFactor.sm),
        border: `1px solid ${theme.colors.borderExtra}`,
        padding: theme.spacing(theme.spacingFactor.md),
    },
}));

export default styles