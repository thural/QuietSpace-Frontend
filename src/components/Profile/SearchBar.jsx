import { Box, Input } from "@mantine/core";
import { useRef } from "react";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import styles from "./styles/searchbarStyles";


const SearchBar = ({ handleInputBlur, handleInputChange, handleInputFocus }) => {

    const classes = styles();
    const queryInputRef = useRef();

    return (
        <Box className={classes.searchbar} >
            <PiMagnifyingGlassBold className={classes.searchIcon} />
            <Input
                variant="unstyled"
                className={classes.searchInput}
                placeholder="search a topic..."
                onFocus={handleInputFocus}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                ref={queryInputRef}
            />
        </Box>
    )
}

export default SearchBar