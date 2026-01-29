import { createUseStyles } from "react-jss";
import { Theme } from "../types/theme";

const styles = createUseStyles((theme: Theme) => ({
    wrapper: {
        paddingTop: theme.spacing(theme.spacingFactor.md * 4),
        '& hr': {
            border: 'none',
            height: '0.1px',
            backgroundColor: theme.colors.hrDivider,
            marginTop: theme.spacing(theme.spacingFactor.md),
        },
        '&:not(:last-child)': { borderBottom: '.1px solid #ccc', },
    }
}));

export default styles