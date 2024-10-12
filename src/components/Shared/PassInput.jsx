import React, { useRef } from "react";


const PassInput = ({ name, value, handleChange, ...props }) => {
    const inputRef = useRef(null);

    function handleClick() {
        inputRef.current.focus();
    }

    return (
        <input
            type='password'
            name={name}
            placeholder={name}
            value={value}
            onChange={handleChange}
            onClick={handleClick}
            ref={inputRef}
            {...props}
        />
    )
};

export default PassInput