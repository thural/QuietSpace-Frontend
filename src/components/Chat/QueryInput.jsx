import React from "react";
import styles from "./styles/queryContainerStyles";


const QueryInput = ({
    handleInputFocus,
    handleInputBlur,
    handleKeyDown,
    queryText,
    handleInputChange
}) => {

    const searchInput = React.useRef(null);
    if (document.activeElement === searchInput.current) {
        console.log("search is focused");
    }

    const classes = styles();

    return (
        <form className={classes.searchInput}>
            <input ref={searchInput}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                className='input'
                type='text'
                name='text'
                placeholder="search a user ..."
                maxLength="128"
                value={queryText}
                onChange={handleInputChange}
            />
        </form>
    )
}

export default QueryInput