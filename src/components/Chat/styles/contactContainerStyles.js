import {createUseStyles} from "react-jss"

const styles = createUseStyles({
    contacts: {
        display: 'flex',
        width: '24rem',
        flexFlow: 'column nowrap',
        borderRight: '1px solid #e8e8e8',
        overflowY: 'overlay'
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
        padding: '1rem',
        flexFlow: 'row nowrap',
        boxShadow: 'rgb(0 0 0 / 50%) 0px 0px 16px -4px',
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
    queryContainer: {
        display: 'none',
        minHeight: '10rem',
        maxHeight: '50%',
        padding: '4px',
        zIndex: '3',
        position: 'relative',
        boxSizing: 'border-box'
    },
    queryItem: {
        width: '100%',
        border: '.2rem solid #3e3e3e',
        margin: '4px 0',
        boxSizing: 'border-box',
        borderRadius: '.8rem',
        background: 'white',
        '& .username': {
            margin: '0.5rem 1rem',
            fontSize: '1.2rem',
            fontWeight: 'bold'
        },
        '& .email': {
            margin: '0.5rem 1rem',
            fontSize: '1rem',
            fontWeight: '300'
        }
    }
});

export default styles
