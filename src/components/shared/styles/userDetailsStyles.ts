import { createUseStyles } from "react-jss";

const styles = createUseStyles({

    userDetails: {
        width: '100%',
        fontWeight: '500',
        boxSizing: 'border-box',
        alignItems: 'center',
        alignContent: 'center',
        '& .username': {
            margin: '0 0.5rem',
            fontWeight: '600',
            alignSelf: 'center',
            alignItems: 'center'
        },
        '& .email': {
            margin: '0 0.5rem',
            fontSize: '1rem',
            fontWeight: '400',
            maxWidth: '50%',
            alignSelf: 'center',
            alignItems: 'center'
        }
    }

})

export default styles