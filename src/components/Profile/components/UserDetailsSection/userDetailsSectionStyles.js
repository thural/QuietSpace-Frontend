import { createUseStyles } from "react-jss";

const styles = createUseStyles({
    detailsSection: {
        display: 'flex',
        justifyContent: 'space-between',
        '& p': {
            fontSize: '1.5rem'
        }
    },
})

export default styles