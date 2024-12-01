import { ConsumerFn } from "@/types/genericTypes";
import useStyles from "@/styles/chat/chatQueryInputStyles"
import InputStyled from "@shared/InputStyled";
import React from "react";

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

    const classes = useStyles();

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