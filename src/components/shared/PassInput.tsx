import { PasswordInput } from "@mantine/core";
import { useRef } from "react";
import { GenericWrapper } from "./types/sharedComponentTypes";


const PassInput: React.FC<GenericWrapper> = ({ name, value, handleChange, ...props }) => {
    const inputRef = useRef(null);

    function handleClick() {
        inputRef.current.focus();
    }

    return (
        <PasswordInput
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