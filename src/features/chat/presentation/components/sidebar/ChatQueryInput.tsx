import useStyles from "../../styles/chatQueryInputStyles";
import { ConsumerFn } from "@/shared/types/genericTypes";
import { Input } from "../../../../../shared/ui/components";
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
        <Input
            onKeyDown={handleKeyDown}
            isStyled={true}
            type='text'
            name='text'
            placeholder="search a user ..."
            maxLength="128"
            onChange={handleInputChange}
            className={classes.chatQuery}
        />
    )
}

export default ChatQueryInput