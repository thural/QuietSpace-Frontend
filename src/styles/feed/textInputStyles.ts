import { TextInputProps } from "@/components/feed/fragments/TextInput";
import { createUseStyles, Theme } from "react-jss";

const useStyles = createUseStyles((theme: Theme) => ({

    textarea: {
        width: '100%',
        outline: 'none',
        boxSizing: 'border-box',
        border: 'none',
        borderRadius: theme.radius.md,
        padding: theme.spacing(theme.spacingFactor.ms),
        backgroundColor: theme.colors.background,
        minHeight: (props: TextInputProps) => props.minHeight || "18vh",
    },

    '@media (max-width: 720px)': {
        textarea: {
            height: '100%'
        },
    }
}));

export default useStyles