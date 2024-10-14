import { createUseStyles } from "react-jss";

const styles = createUseStyles({
    chatContainer: {
        display: 'flex',
        width: '24rem',
        flexFlow: 'column nowrap',
        borderRight: '1px solid #e8e8e8',
        overflowY: 'overlay',
        overflowX: 'hidden',
        position: 'relative'
    },
});

export default styles
