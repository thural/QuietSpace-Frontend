import { createUseStyles } from "react-jss";

const styles = createUseStyles({

    wrapper: {
        paddingTop: '4rem',
        '& hr': {
            border: 'none',
            height: '0.5px',
            backgroundColor: 'rgb(204 204 204)'
        }
    },

})

export default styles