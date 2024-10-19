import FormStyled from "@shared/FormStyled";
import InputStyled from "@shared/InputStyled";
import styles from "./styles/chatQueryStyles";


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
        <FormStyled>
            <InputStyled ref={searchInput}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
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