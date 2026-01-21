import { createUseStyles } from "react-jss";
import { Theme } from "../types/theme";

const styles = createUseStyles((theme: Theme) => ({

    userDetails: {
        color: theme.colors.text,
        width: '100%',
        alignItems: 'center',
        alignContent: 'center',
        boxSizing: 'border-box',
        fontWeight: theme.typography.fontWeightRegular,
        '& .username': {
            alignSelf: 'center',
            alignItems: 'center',
            margin: `0 ${theme.spacing(0.5)}`,
            fontWeight: theme.typography.fontWeightBold,
        },
        '& .email': {
            maxWidth: '50%',
            alignSelf: 'center',
            alignItems: 'center',
            margin: `0 ${theme.spacing(0.5)}`,
            fontSize: theme.typography.fontSize,
            fontWeight: theme.typography.fontWeightRegular,
        }
    }

}));

export default styles