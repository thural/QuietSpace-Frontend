import { createUseStyles } from "react-jss";

const styles = createUseStyles({

    notificationCard: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        borderBottom: ".1rem solid #e3e3e3",
        padding: ".5rem 0",

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
            borderRadius: '.75rem',
            backgroundColor: 'rgb(250, 250, 250)'
        },
    },

    notificationDetails: {
        width: '100%',
        boxSizing: 'border-box',
        '& .username, .message': {
            margin: '0.25rem 0.5rem',
        },
        '& .email': {
            margin: '0.25rem 0.5rem',
            fontSize: '1rem',
            fontWeight: '300',
            maxWidth: '50%'
        }
    }

})

export default styles