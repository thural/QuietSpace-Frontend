import { TextInputProps } from "@/components/feed/fragments/TextInput";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles(() => ({

    textarea: {
        width: '100%',
        outline: 'none',
        boxSizing: 'border-box',
        border: 'none',
        minHeight: (props: TextInputProps) => props.minHeight || "18vh",
    },

    '@media (max-width: 720px)': {
        textarea: {
            height: '100%'
        },
    }
}));

export default useStyles