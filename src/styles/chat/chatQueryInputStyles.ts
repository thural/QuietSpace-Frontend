import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
    inputStyled: {
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
    },
});

export default useStyles