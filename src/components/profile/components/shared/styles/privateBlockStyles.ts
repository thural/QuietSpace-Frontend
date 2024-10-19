import { createUseStyles } from "react-jss";

const styles = createUseStyles({
    privateBlock: {
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        margin: '3rem',
    },
    icon: {
        fontSize: '2.5rem'
    },
    primaryMessage: {
        alignSelf: 'flex-start',
        margin: '0rem'
    },
    messageSection: {
        display: 'flex',
        flexDirection: 'column',
        '& p': {
            fontSize: '.85rem'
        },
        '& button': {
            margin: '1rem 0rem'
        }
    }
});

export default styles