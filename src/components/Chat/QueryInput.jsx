import React, { useRef } from "react";
import FormStyled from "../Shared/Form";
import InputStyled from "../Shared/InputStyled";
import styles from "./styles/queryContainerStyles";


const QueryInput = ({
    handleInputFocus,
    handleInputBlur,
    handleKeyDown,
    queryText,
    handleInputChange
}) => {

    const searchInput = useRef(null);
    if (document.activeElement === searchInput.current) {
    }

    const classes = styles();

    return (
        <FormStyled className={classes.searchInput}>
            <InputStyled ref={searchInput}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                className='input'
                type='text'
                name='text'
                placeholder="search a user ..."
                maxLength="128"
                onChange={handleInputChange}
            />
        </FormStyled>
    )
}

export default QueryInput