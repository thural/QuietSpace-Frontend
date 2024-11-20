import { ConsumerFn } from "@/types/genericTypes";
import React from "react";
import { createUseStyles } from "react-jss";
import { GenericWrapper } from "../../types/sharedComponentTypes";

interface TextInputStyledProps extends GenericWrapper {
    name: string,
    value: string | number,
    handleChange: ConsumerFn,
    placeholder?: string,
    maxLength?: string,
    minLength?: string,
    hidden?: boolean,
    isStyled?: boolean
}


const TextInputStyled: React.FC<TextInputStyledProps> = ({
    name = "",
    value,
    handleChange,
    placeholder = "",
    maxLength = "999",
    minLength = "0",
    hidden = false,
    isStyled = true,
    ...props
}) => {

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
            '& :focus': {
                outline: 'none',
                borderColor: '#a7abb1',
            },
        },
        unstyled: {
            width: '100%',
            border: 'none',
            height: '2rem',
            boxSizing: 'border-box',
        }
    });

    const classes = useStyles();
    const wrapperClass = isStyled ? classes.input : classes.unstyled

    return (
        <input className={wrapperClass}
            type='text'
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            hidden={hidden}
            {...props}
        />
    )
};

export default TextInputStyled