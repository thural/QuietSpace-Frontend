import { createUseStyles } from "react-jss";

const styles = createUseStyles({
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

})

export default styles