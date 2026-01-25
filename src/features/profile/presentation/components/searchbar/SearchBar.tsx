import { SearchBarSecondary, SearchIcon } from "@/features/search/presentation/styles/SearchBarStyles";
import { Input } from "../../../../../shared/ui/components";
import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import { ChangeEventHandler, FocusEventHandler, useRef } from "react";
import { PiMagnifyingGlassBold } from "react-icons/pi";

/**
 * SearchBarProps interface.
 * 
 * This interface defines the props for the SearchBar component.
 * 
 * @property {FocusEventHandler<HTMLInputElement>} handleInputBlur - Callback function triggered when the input loses focus.
 * @property {ChangeEventHandler<HTMLInputElement>} handleInputChange - Callback function triggered when the input value changes.
 * @property {FocusEventHandler<HTMLInputElement>} handleInputFocus - Callback function triggered when the input gains focus.
 * @property {string} [placeHolder="search a topic..."] - Optional placeholder text for the input field.
 */
export interface SearchBarProps extends GenericWrapper {
    handleInputBlur: FocusEventHandler<HTMLInputElement>;
    handleInputChange: ChangeEventHandler<HTMLInputElement>;
    handleInputFocus: FocusEventHandler<HTMLInputElement>;
    placeHolder?: string;
}

/**
 * SearchBar component.
 * 
 * This component renders a search bar with a magnifying glass icon. 
 * It accepts callback functions for handling input focus, blur, and change events.
 * The component is styled using the provided styles and allows for an optional placeholder text.
 * 
 * @param {SearchBarProps} props - The component props.
 * @returns {JSX.Element} - The rendered SearchBar component.
 */
const SearchBar: React.FC<SearchBarProps> = ({
    handleInputBlur,
    handleInputChange,
    handleInputFocus,
    placeHolder = "search a topic..."
}) => {
    const queryInputRef = useRef<HTMLInputElement>(null); // Create a reference for the input element

    return (
        <SearchBarSecondary>
            <SearchIcon>
                <PiMagnifyingGlassBold />
            </SearchIcon>
            <Input
                placeholder={placeHolder}
                onFocus={handleInputFocus} // Trigger handleInputFocus on focus
                onChange={handleInputChange} // Trigger handleInputChange on input change
                onBlur={handleInputBlur} // Trigger handleInputBlur on blur
                ref={queryInputRef} // Assign the input reference
            />
        </SearchBarSecondary>
    );
}

export default SearchBar;