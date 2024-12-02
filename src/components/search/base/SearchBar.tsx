import InputStyled from "@/components/shared/InputStyled";
import { GenericWrapperWithRef } from "@/types/sharedComponentTypes";
import { Box } from "@mantine/core";
import { ChangeEventHandler, CSSProperties, FocusEventHandler, KeyboardEventHandler, RefObject } from 'react';
import { PiMagnifyingGlassBold, PiMicrophone } from "react-icons/pi";
import styles from "@/styles/search/searchBarStyles";

export interface SearchBarProps extends GenericWrapperWithRef {
    style?: CSSProperties;
    handleKeyDown: KeyboardEventHandler<HTMLInputElement>;
    handleInputBlur: FocusEventHandler<HTMLInputElement>;
    handleInputFocus: FocusEventHandler<HTMLInputElement>;
    handleInputChange: ChangeEventHandler<HTMLInputElement>;
    queryInputRef: RefObject<HTMLInputElement>;
}

const SearchBar: React.FC<SearchBarProps> = ({ style, handleKeyDown, handleInputBlur, handleInputFocus, handleInputChange, queryInputRef }) => {

    const classes = styles();

    return (
        <Box className={classes.searchbar} style={style}>
            <PiMagnifyingGlassBold className={classes.searchIconLarge} />
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
            <PiMicrophone className={classes.searchIconLarge} />
        </Box>
    )
};

export default SearchBar