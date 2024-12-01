import { createUseStyles, Theme } from "react-jss";

const styles = createUseStyles((theme: Theme) => ({

    userCard: {
        display: 'flex',
        alignItems: 'center',
        margin: '.5rem 0',
        width: '100%',

        '& button': {
            color: 'black',
            height: '2rem',
            width: '8rem',
            cursor: 'pointer',
            border: '1px solid #afafaf',
            display: 'block',
            padding: '0 1rem',
            fontSize: '.85rem',
            fontWeight: '500',
            marginLeft: 'auto',
            borderRadius: '.75rem',
            backgroundColor: theme.colors.background
        },
    },

}))

export default styles