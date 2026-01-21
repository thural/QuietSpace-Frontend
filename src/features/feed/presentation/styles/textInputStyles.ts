import { TextInputProps } from "@/features/feed/presentation/components/fragments/TextInput";
import { createUseStyles } from "react-jss";
import { Theme } from "../../../../shared/types/theme";

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