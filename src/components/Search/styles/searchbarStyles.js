import { createUseStyles } from "react-jss";

const styles = createUseStyles({
    container: {
        paddingTop: '4rem'
    },

    searchbar: {
        display: 'flex',
        margin: "1rem 0",
        position: 'relative',
        border: '1px solid rgb(188, 188, 188)',
        borderRadius: '2rem',
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
        fontSize: '2rem',
        color: 'rgb(188, 188, 188)'
    },

    resultContainer: {
        width: '100%',
        height: '50vh',
        display: 'none',
        zIndex: '3',
        padding: '1rem',
        boxShadow: '0 4px 8px -4px rgba(72, 72, 72, 0.3)',
        borderRadius: "1rem 1rem 1rem 1rem",
        borderBottom: '1px solid gainsboro',
        boxSizing: 'border-box',
        backgroundColor: 'rgb(250, 250, 250)'
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