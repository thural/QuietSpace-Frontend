import { ConsumerFn } from "@/types/genericTypes";
import React from "react";
import { createUseStyles, Theme } from "react-jss";
import { GenericWrapper } from "@/types/sharedComponentTypes";

interface TextAreaStyledProps extends GenericWrapper {
    name: string,
    value: string | number,
    handleChange: ConsumerFn,
    placeholder: string,
    maxLength?: number,
    minLength?: number,
    hidden?: boolean,
}


const TextAreaStyled: React.FC<TextAreaStyledProps> = ({
    name = "",
    value,
    handleChange,
    placeholder = "",
    maxLength = 999,
    minLength = 0,
    hidden = false,
    ...props
}) => {

    const useStyles = createUseStyles((theme: Theme) => ({
        textarea: {
            width: '100%',
            resize: 'none',
            outline: 'none',
            boxSizing: 'border-box',
            borderRadius: theme.radius.md,
            padding: theme.spacing(theme.spacingFactor.ms),
            backgroundColor: theme.colors.background,
            border: `1px solid ${theme.colors.border}`,
        },
    }));

    const classes = useStyles();

    return (
        <textarea className={classes.textarea}
            name={name}
            placeholder={placeholder}
            maxLength={maxLength}
            minLength={minLength}
            value={value}
            onChange={handleChange}
            {...props}
        >
        </textarea>
    )
};

export default TextAreaStyled