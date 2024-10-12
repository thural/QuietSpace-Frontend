import { Input } from "@mantine/core"

const InputStyled = ({ placeholder, onKeyDown, onFocus, onChange, onBlur, variant, ...props }) => {

    return (
        <Input
            variant={variant}
            placeholder={placeholder}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onChange={onChange}
            onBlur={onBlur}
            {...props}
        />
    )
}

export default InputStyled