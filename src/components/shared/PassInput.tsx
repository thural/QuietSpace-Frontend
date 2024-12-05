import useStyles from "@/styles/shared/inputStyles";
import { GenericWrapper } from "@/types/sharedComponentTypes";


const PassInput: React.FC<GenericWrapper> = ({ name, value, handleChange, ...props }) => {

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