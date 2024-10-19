import { createUseStyles } from "react-jss";

const styles = createUseStyles({

    userDetails: {
        width: '100%',
        boxSizing: 'border-box',
        '& .username': {
            margin: '0 0.5rem',
            fontWeight: '500',
        },
        '& .email': {
            margin: '0 0.5rem',
            fontSize: '1rem',
            fontWeight: '300',
            maxWidth: '50%'
        }
    }

})

export default styles