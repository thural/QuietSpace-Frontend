import { createUseStyles } from "react-jss";

const styles = createUseStyles({

    followSection: {
        margin: '1.5rem 0',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '1.5rem',
        '& .signout-icon': {
            width: '2.5rem',
            height: '2.5rem',
            display: 'flex',
            padding: '0',
            boxSizing: 'border-box',
            borderRadius: '3rem',
            backgroundColor: 'whitesmoke',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(134, 142, 150, 0.1)'
        }
    },

})

export default styles