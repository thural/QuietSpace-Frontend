import { createUseStyles } from "react-jss";

const styles = createUseStyles({

    container: {
        paddingTop: '4rem',
        '& a': {
            all: 'unset',
            textDecoration: 'none'
        }
    },

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

    avatarGroup: {
        alignItems: 'center',
        '& p': {
            margin: '0 .3rem'
        }
    },

    searchbar: {
        display: 'flex',
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

})

export default styles