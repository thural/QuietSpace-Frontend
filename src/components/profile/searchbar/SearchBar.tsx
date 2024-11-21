import BoxStyled from "@/components/shared/BoxStyled";
import InputStyled from "@/components/shared/InputStyled";
import { GenericWrapper } from "@/types/sharedComponentTypes";
import styles from "@/styles/profile/searchbarStyles";
import { ChangeEventHandler, FocusEventHandler, useRef } from "react";
import { PiMagnifyingGlassBold } from "react-icons/pi";

export interface SearchBarProps extends GenericWrapper {
    handleInputBlur: FocusEventHandler<HTMLInputElement>
    handleInputChange: ChangeEventHandler<HTMLInputElement>
    handleInputFocus: FocusEventHandler<HTMLInputElement>
    placeHolder?: string
}

const SearchBar: React.FC<SearchBarProps> = ({ handleInputBlur, handleInputChange, handleInputFocus, placeHolder = "search a topic..." }) => {

    const classes = styles();
    const queryInputRef = useRef();

    return (
        <BoxStyled className={classes.searchbar} >
            <PiMagnifyingGlassBold className={classes.searchIcon} />
            <InputStyled
                className={classes.searchInput}
                placeholder={placeHolder}
                onFocus={handleInputFocus}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                ref={queryInputRef}
            />
        </BoxStyled>
    )
}

export default SearchBar