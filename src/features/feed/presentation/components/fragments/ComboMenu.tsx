import BoxStyled from "@/shared/BoxStyled";
import Clickable from "@/shared/Clickable";
import ListMenu from "@/shared/ListMenu";
import { ConsumerFn } from "@/shared/types/genericTypes";

/**
 * Props for the ComboMenu component.
 * 
 * @interface ComboMenuProps
 * @property {Array<string>} options - The list of options to display in the menu.
 * @property {string} selectedOption - The currently selected option.
 * @property {string} textContent - Additional text to display alongside the selected option.
 * @property {ConsumerFn} handleSelect - Function to handle the selection of an option.
 */
interface ComboMenuProps {
    options: Array<string>;
    selectedOption: string;
    textContent: string;
    handleSelect: ConsumerFn;
}

/**
 * ComboMenu component.
 * 
 * This component renders a dropdown menu (combo box) that displays a list of options.
 * The currently selected option is shown prominently, and the user can select from the
 * available options. When an option is selected, the `handleSelect` function is called
 * with the selected option.
 * 
 * @param {ComboMenuProps} props - The component props.
 * @returns {JSX.Element} - The rendered ComboMenu component.
 */
const ComboMenu: React.FC<ComboMenuProps> = ({ options, selectedOption, textContent, handleSelect }) => {
    return (
        <BoxStyled style={{ position: "relative" }}>
            <ListMenu menuIcon={selectedOption.concat(" ").concat(textContent)}>
                {options.map((option, index) => (
                    <Clickable
                        key={index}
                        handleClick={() => handleSelect(option)}
                        alt={"option"}
                        text={option}
                    />
                ))}
            </ListMenu>
        </BoxStyled>
    );
};

export default ComboMenu;