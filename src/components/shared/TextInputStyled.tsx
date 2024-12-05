import { ConsumerFn } from "@/types/genericTypes";
import React from "react";
import useStyles from "@/styles/shared/inputStyles";
import { GenericWrapper } from "@/types/sharedComponentTypes";

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
    placeholder,
    maxLength = "999",
    minLength = "0",
    hidden = false,
    isStyled = true,
    ...props
}) => {

    const classes = useStyles();

    return (
        <input className={classes.input}
            type='text'
            name={name}
            placeholder={placeholder ? placeholder : name}
            value={value}
            onChange={handleChange}
            hidden={hidden}
            {...props}
        />
    )
};

export default TextInputStyled