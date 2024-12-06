import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
    listItem: {
        padding: '10px 20px',
        '&:not(:last-child)': { borderBottom: '.1px solid #ccc', },
    },
});

export default useStyles