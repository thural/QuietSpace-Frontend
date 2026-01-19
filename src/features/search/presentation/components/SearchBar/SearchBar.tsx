/**
 * SearchBar Component.
 * 
 * Renders a search input field with search and voice icons.
 * Handles user input events and provides search functionality.
 */

import InputStyled from "@/shared/InputStyled";
import { GenericWrapperWithRef } from "@/types/sharedComponentTypes";
import { Box } from "@mantine/core";
import { ChangeEventHandler, CSSProperties, FocusEventHandler, KeyboardEventHandler, RefObject } from 'react';
import { PiMagnifyingGlassBold, PiMicrophone } from "react-icons/pi";
import styles from "../../styles/searchBarStyles";

/**
 * SearchBarProps interface.
 * 
 * This interface defines the props for the SearchBar component.
 * 
 * @property {CSSProperties} [style] - Optional inline styles for the search bar.
 * @property {KeyboardEventHandler<HTMLInputElement>} handleKeyDown - Callback function triggered on key down events.
 * @property {FocusEventHandler<HTMLInputElement>} handleInputBlur - Callback function triggered when the input loses focus.
 * @property {FocusEventHandler<HTMLInputElement>} handleInputFocus - Callback function triggered when the input gains focus.
 * @property {ChangeEventHandler<HTMLInputElement>} handleInputChange - Callback function triggered when the input value changes.
 * @property {RefObject<HTMLInputElement>} queryInputRef - Reference object for the input element.
 */
export interface SearchBarProps extends GenericWrapperWithRef {
    style?: CSSProperties;
    handleKeyDown: KeyboardEventHandler<HTMLInputElement>;
    handleInputBlur: FocusEventHandler<HTMLInputElement>;
    handleInputFocus: FocusEventHandler<HTMLInputElement>;
    handleInputChange: ChangeEventHandler<HTMLInputElement>;
    queryInputRef: RefObject<HTMLInputElement | null>;
}

/**
 * SearchBar component.
 * 
 * This component renders a search bar with input and icons for searching and voice input.
 * It accepts various event handlers to manage user interactions and a reference for the input element.
 * 
 * @param {SearchBarProps} props - The component props.
 * @returns {JSX.Element} - The rendered SearchBar component.
 */
const SearchBar: React.FC<SearchBarProps> = ({
    style,
    handleKeyDown,
    handleInputBlur,
    handleInputFocus,
    handleInputChange,
    queryInputRef
}) => {
    const classes = styles(); // Apply custom styles

    return (
        <Box className={classes.searchbar} style={style}>
            <PiMagnifyingGlassBold className={classes.searchIconLarge} /> {/* Search icon */}
            <InputStyled
                placeholder="Search"
                ref={queryInputRef}
                onKeyDown={handleKeyDown}
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                onChange={handleInputChange}
                className={classes.searchInput}
            />
            <PiMicrophone className={classes.microphoneIcon} /> {/* Voice search icon */}
        </Box>
    );
};

export default SearchBar;
