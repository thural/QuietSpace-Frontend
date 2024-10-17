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
});

export default styles