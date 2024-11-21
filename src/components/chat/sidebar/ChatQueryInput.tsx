import { ConsumerFn } from "@/types/genericTypes";
import InputStyled from "@shared/InputStyled";
import React from "react";
import { createUseStyles } from "react-jss";

const styles = createUseStyles({
    inputStyled: {
        gap: '1rem',
        color: 'black',
        width: '100%',
        height: 'fit-content',
        margin: 'auto',
        display: 'flex',
        padding: '.5rem',
        flexFlow: 'row nowrap',
        boxSizing: 'border-box',
        alignItems: 'center',
        backgroundColor: 'white',
    },
});

interface QueryInputProps {
    handleInputFocus: ConsumerFn,
    handleInputBlur: ConsumerFn,
    handleKeyDown: ConsumerFn,
    handleInputChange: ConsumerFn,
    searchInputRef: React.RefObject<HTMLDivElement>
}

const ChatQueryInput: React.FC<QueryInputProps> = ({
    handleKeyDown,
    handleInputChange,
}) => {

    const classes = styles();

    return (
        <InputStyled
            onKeyDown={handleKeyDown}
            isStyled={true}
            type='text'
            name='text'
            placeholder="search a user ..."
            maxLength="128"
            onChange={handleInputChange}
            className={classes.inputStyled}
        />
    )
}

export default ChatQueryInput