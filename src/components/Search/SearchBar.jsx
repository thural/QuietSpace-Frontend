import { Box } from "@mantine/core";
import { PiMagnifyingGlassBold, PiMicrophone } from "react-icons/pi";
import InputStyled from "../Shared/InputStyled";
import styles from "./styles/searchBarStyles";

const SearchBar = ({ style, handleKeyDown, handleInputBlur, handleInputFocus, handleInputChange, queryInputRef }) => {

    const classes = styles();

    return (
        <Box className={classes.searchbar} style={style}>
            <PiMagnifyingGlassBold className={classes.searchIcon} />
            <InputStyled
                variant="unstyled"
                className={classes.searchInput}
                placeholder="search a topic"
                onKeyDown={handleKeyDown}
                onFocus={handleInputFocus}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                ref={queryInputRef}
            />
            <PiMicrophone className={classes.searchIcon} />
        </Box>
    )
};

export default SearchBar