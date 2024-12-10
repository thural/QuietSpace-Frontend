import { useCallback, useState } from "react";

const useFormInput = <T = string>(
    initialValue: T,
    options: { preventDefault?: boolean } = { preventDefault: true }
) => {
    const [value, setValue] = useState<T>(initialValue);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (options.preventDefault) {
            e.preventDefault();
            e.stopPropagation();
        }
        setValue(e.target.value as T);
    }, [options.preventDefault]);

    return { value, setValue, handleChange };
};

export default useFormInput