import React, { useRef } from "react";
import { GenericWrapper } from "./types/sharedComponentTypes";


const TextInput: React.FC<GenericWrapper> = ({
    name = "",
    value,
    handleChange,
    placeholder = "",
    maxLength = "999",
    minLength = "0",
    hidden = false,
    ...props
}) => {

    const inputRef = useRef(null);

    function handleClick() {
        inputRef.current.focus();
    }

    return (
        <input
            type='text'
            name={name}
            placeholder={name}
            value={value}
            onChange={handleChange}
            onClick={handleClick}
            hidden={hidden}
            ref={inputRef}
            {...props}
        />
    )
};

export default TextInput