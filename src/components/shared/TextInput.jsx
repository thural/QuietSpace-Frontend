import React, { useRef } from "react";


const TextInput = ({
    name,
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
            maxLength={maxLength}
            placeholder={name}
            value={value}
            minLength={minLength}
            onChange={handleChange}
            onClick={handleClick}
            hidden={hidden}
            ref={inputRef}
            {...props}
        />
    )
};

export default TextInput