import FormStyled from "@shared/FormStyled";
import InputStyled from "@shared/InputStyled";
import styles from "./styles/chatQueryStyles";
import React from "react";
import { ConsumerFn } from "@/types/genericTypes";

interface QueryInputProps {
    handleInputFocus: ConsumerFn,
    handleInputBlur: ConsumerFn,
    handleKeyDown: ConsumerFn,
    handleInputChange: ConsumerFn,
    searchInputRef: React.RefObject<HTMLDivElement>
}

const QueryInput: React.FC<QueryInputProps> = ({
    handleKeyDown,
    handleInputChange,
}) => {

    const classes = styles();

    return (
        <FormStyled>
            <InputStyled
                onKeyDown={handleKeyDown}
                type='text'
                name='text'
                placeholder="search a user ..."
                maxLength="128"
                onChange={handleInputChange}
                className={classes.searchInput}
            />
        </FormStyled>
    )
}

export default QueryInput