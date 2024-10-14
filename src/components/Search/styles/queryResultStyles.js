import { createUseStyles } from "react-jss";

const styles = createUseStyles({

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
    }

});

export default styles