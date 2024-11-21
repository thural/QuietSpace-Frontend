import { createUseStyles } from "react-jss";

const styles = createUseStyles({
    searchContainer: {

    },
    contacts: {
        display: 'flex',
        flexFlow: 'column nowrap',
        borderRight: '1px solid',
        gridColumn: '1/2',
        position: 'relative'
    },
    searchSection: {
        zIndex: '1'
    },
    resultContainer: {
        width: '100%',
        flexDirection: 'column',
        display: 'none',
        padding: '4px',
        zIndex: '3',
        position: 'absolute',
        boxShadow: '0 4px 6px -4px rgba(72, 72, 72, 0.3)',
        borderBottom: '1px solid gainsboro',
        boxSizing: 'border-box',
        minHeight: '16rem',
        backgroundColor: 'white',
        gap: '.5rem'
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
    }
});

export default styles
