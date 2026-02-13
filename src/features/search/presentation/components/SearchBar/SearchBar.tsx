/**
 * SearchBar Component.
 * 
 * Renders a search input field with search and voice icons.
 * Handles user input events and provides search functionality.
 */

import { SearchBar as UISearchBar } from '../../../../../shared/ui/components/content';
import type { ISearchBarProps } from '../../../../../shared/ui/components/content';
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes";
import { Container } from "@shared/ui/components/layout/Container";
import { ChangeEventHandler, FocusEventHandler, KeyboardEventHandler, RefObject } from 'react';

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
export interface SearchBarProps extends Omit<GenericWrapperWithRef, 'style'> {
    style?: React.CSSProperties;
    handleKeyDown: KeyboardEventHandler<HTMLInputElement>;
    handleInputBlur: FocusEventHandler<HTMLInputElement>;
    handleInputFocus: FocusEventHandler<HTMLInputElement>;
    handleInputChange: ChangeEventHandler<HTMLInputElement>;
    queryInputRef: RefObject<HTMLInputElement>;
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
    // Convert to UI SearchBar props
    const searchBarProps: ISearchBarProps = {
        placeholder: "Search",
        value: queryInputRef.current?.value || "",
        onChange: (value: string) => {
            // Simulate input change event
            const syntheticEvent = {
                target: { value }
            } as React.ChangeEvent<HTMLInputElement>;
            handleInputChange(syntheticEvent);
        },
        onSearch: (value: string) => {
            // Handle search submission
            console.log(`Searching for: ${value}`);
        },
        showClear: true,
        showIcon: true,
        showMicrophone: true,
        onMicrophone: () => {
            console.log('Voice search activated');
        },
        variant: 'default',
        size: 'medium',
        disabled: false,
        loading: false,
        ...(style && { style }),
        className: '',
    };

    return (
        <Container style={style || {}}>
            <UISearchBar {...searchBarProps} />
        </Container>
    );
};

export default SearchBar;
