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
    searchInput: {
        gap: '1rem',
        color: 'black',
        width: '100%',
        height: 'fit-content',
        margin: 'auto',
        display: 'flex',
        padding: '.5rem',
        flexFlow: 'row nowrap',
        boxSizing: 'border-box',
        alignItems: 'center',
        backgroundColor: 'white',
        '& button': {
            color: 'white',
            width: 'fit-content',
            border: '1px solid black',
            padding: '4px 8px',
            fontSize: '1rem',
            fontWeight: '500',
            borderRadius: '1rem',
            backgroundColor: 'black'
        },
        '& .input': {
            display: 'flex',
            flexFlow: 'column nowrap',
            gap: '0.5rem',
        },
        '& input': {
            boxSizing: 'border-box',
            width: '100%',
            padding: '10px',
            height: '1.8rem',
            backgroundColor: '#e2e8f0',
            border: '1px solid #e2e8f0',
            borderRadius: '10px'
        },
        '& input:focus': {
            outline: 'none',
            borderColor: '#a7abb1',
        }
    },
    resultContainer: {
        width: '100%',
        flexDirection: 'column',
        display: 'none',
        padding: '4px',
        zIndex: '3',
        position: 'absolute',
        // boxShadow: '0 4px 6px -4px rgba(72, 72, 72, 0.3)',
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
