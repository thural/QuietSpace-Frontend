import { createUseStyles, Theme } from "react-jss";

const styles = createUseStyles((theme: Theme) => ({

    userDetails: {
        width: '100%',
        fontWeight: theme.typography.fontWeightRegular,
        boxSizing: 'border-box',
        alignItems: 'center',
        alignContent: 'center',
        '& .username': {
            margin: `0 ${theme.spacing(0.5)}`,
            fontWeight: theme.typography.fontWeightBold,
            alignSelf: 'center',
            alignItems: 'center'
        },
        '& .email': {
            margin: `0 ${theme.spacing(0.5)}`,
            fontSize: theme.typography.fontSize,
            fontWeight: theme.typography.fontWeightRegular,
            maxWidth: '50%',
            alignSelf: 'center',
            alignItems: 'center'
        }
    }

}))

export default styles