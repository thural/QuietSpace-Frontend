import React, { useRef } from "react";


const TextInput = ({
    name,
    value,
    handleChange,
    placeholder = "",
    maxLength = "999",
    minLength = "0",
    hidden = false }) => {

    const inputRef = useRef(null);

    function handleClick() {
        inputRef.current.focus();
    }

    return (
        <input
            type='text'
            name={name}
            maxLength={maxLength}
            placeholder={placeholder}
            value={value}
            minLength={minLength}
            onChange={handleChange}
            onClick={handleClick}
            hidden={hidden}
            ref={inputRef}
        />
    )
};

export default TextInput