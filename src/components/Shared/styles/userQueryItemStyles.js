import { createUseStyles } from "react-jss";

const styles = createUseStyles({

    userCard: {
        display: 'flex',
        alignItems: 'center',
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
            marginTop: '1rem',
            fontWeight: '500',
            marginLeft: 'auto',
            alignSelf: 'baseline',
            borderRadius: '.75rem',
            backgroundColor: 'rgb(250, 250, 250)'
        },
    },

})

export default styles