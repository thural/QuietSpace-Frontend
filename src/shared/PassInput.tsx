import useStyles from "@/shared/styles/inputStyles";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";


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