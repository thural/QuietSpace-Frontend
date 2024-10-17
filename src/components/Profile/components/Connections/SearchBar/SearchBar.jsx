import BoxStyled from "@shared/BoxStyled";
import InputStyled from "@shared/InputStyled";
import { useRef } from "react";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import styles from "./searchbarStyles";


const SearchBar = ({ handleInputBlur, handleInputChange, handleInputFocus }) => {

    const classes = styles();
    const queryInputRef = useRef();

    return (
        <BoxStyled className={classes.searchbar} >
            <PiMagnifyingGlassBold className={classes.searchIcon} />
            <InputStyled
                variant="unstyled"
                className={classes.searchInput}
                placeholder="search a topic..."
                onFocus={handleInputFocus}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                ref={queryInputRef}
            />
        </BoxStyled>
    )
}

export default SearchBar