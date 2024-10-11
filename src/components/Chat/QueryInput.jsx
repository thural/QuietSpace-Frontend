import React, { useRef } from "react";
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
        <form className={classes.searchInput}>
            <input ref={searchInput}
                onFocus={handleInputFocus}
                // onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                className='input'
                type='text'
                name='text'
                placeholder="search a user ..."
                maxLength="128"
                onChange={handleInputChange}
            />
        </form>
    )
}

export default QueryInput