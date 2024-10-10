import { useRef } from "react";
import styles from "./styles/searchBarStyles";
import { Box, Input } from "@mantine/core";
import { PiMagnifyingGlassBold, PiMicrophone } from "react-icons/pi";

const SearchBar = ({ style, handleKeyDown, handleInputBlur, handleInputFocus, handleInputChange }) => {

    const classes = styles();
    const queryInputRef = useRef();

    return (
        <Box className={classes.searchbar} style={style}>
            <PiMagnifyingGlassBold className={classes.searchIcon} />
            <Input
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