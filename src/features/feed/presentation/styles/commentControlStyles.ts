import { createUseStyles } from "react-jss"

const useStyles = createUseStyles({

    commentOptions: {
        width: '100%',
        justifyContent: 'flex-start',
        gap: '10px',
        color: '#303030',
        display: 'flex',
        flexFlow: 'row nowrap',
        fontSize: '.8rem',
        fontWeight: '500',
        '& > *': {
            cursor: 'pointer',
        },
        '& p': {
            margin: '0',
            fontSize: '.8rem',
            color: '#4d4d4d'
        }
    },
})

export default useStyles