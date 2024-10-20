import { Box } from "@mantine/core";
import InputStyled from "@/components/shared/InputStyled";
import { PiMagnifyingGlassBold, PiMicrophone } from "react-icons/pi";
import styles from "./styles/searchBarStyles";
import { SearchBarProps } from "./types/SearchBarTypes";

const SearchBar: React.FC<SearchBarProps> = ({ style, handleKeyDown, handleInputBlur, handleInputFocus, handleInputChange, queryInputRef }) => {

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