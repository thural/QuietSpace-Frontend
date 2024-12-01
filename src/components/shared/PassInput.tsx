import { createUseStyles } from "react-jss";
import { GenericWrapper } from "@/types/sharedComponentTypes";


const PassInput: React.FC<GenericWrapper> = ({ name, value, handleChange, ...props }) => {

    const useStyles = createUseStyles({
        input: {
            boxSizing: 'border-box',
            width: '100%',
            padding: '10px',
            height: '2rem',
            backgroundColor: '#e2e8f0',
            border: '1px solid #e2e8f0',
            outline: 'none',
            borderRadius: '10px',
            '&:focus': {
                outline: 'none',
                borderColor: '#a7abb1',
            },
        },
    });

    const classes = useStyles();

    return (
        <input
            className={classes.input}
            type='password'
            name={name}
            placeholder={name}
            value={value}
            onChange={handleChange}
            {...props}
        />
    )
};

export default PassInput