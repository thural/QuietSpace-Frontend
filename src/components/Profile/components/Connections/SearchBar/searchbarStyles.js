import { createUseStyles } from "react-jss";

const styles = createUseStyles({
    container: {
        paddingTop: '4rem',
        gap: '.5rem',
        top: '50%',
        left: '50%',
        color: 'black',
        height: '50vh',
        border: '1px solid gray',
        margin: 'auto',
        display: 'block',
        padding: '1rem',
        zIndex: '3',
        position: 'fixed',
        flexFlow: 'row nowrap',
        transform: 'translate(-50%, -50%)',
        borderRadius: '1em',
        backgroundColor: 'white',
    },

    searchbar: {
        display: 'flex',
        margin: "1rem 0",
        position: 'relative',
        border: '1px solid rgb(188, 188, 188)',
        borderRadius: '1rem',
        backgroundColor: 'rgb(250, 250, 250)',
        minWidth: '320px',
        alignItems: 'center',
        justifyContent: 'center'
    },

    searchInput: {
        outline: '0',
        width: "100%",
        padding: '0.5rem 0rem',
        fontSize: '1rem',
        minWidth: '360px',
    },

    searchIcon: {
        margin: '0 1rem',
        fontSize: '1.5rem',
        color: 'rgb(188, 188, 188)'
    },

    resultContainer: {
        width: '100%',
        height: 'fit-content',
        display: 'block',
        boxSizing: 'border-box',
    },

    recentQueries: {
        width: '100%',
        padding: '0 .5rem',
        background: 'white',
        boxSizing: 'border-box',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    queryCard: {
        display: 'flex',
        alignItems: 'center',
        width: '100%'
    },
    queryItem: {
        width: '100%',
        background: 'white',
        boxSizing: 'border-box',
        '& .username': {
            margin: '0.25rem 0.5rem',
        },
        '& .email': {
            margin: '0.25rem 0.5rem',
            fontSize: '1rem',
            fontWeight: '300',
            maxWidth: '10em'
        }
    }

})

export default styles