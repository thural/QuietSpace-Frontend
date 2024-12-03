import BoxStyled from "@/components/shared/BoxStyled";
import Clickable from "@/components/shared/Clickable";
import ListMenu from "@/components/shared/ListMenu";
import { ConsumerFn } from "@/types/genericTypes";

interface ComboMenuProps {
    options: Array<string>
    selectedOption: string
    textContent: string
    handleSelect: ConsumerFn
}

const ComboMenu: React.FC<ComboMenuProps> = ({ options, selectedOption, textContent, handleSelect }) => {

    return (
        <BoxStyled style={{ position: "relative" }}>
            <ListMenu menuIcon={selectedOption.concat(" ").concat(textContent)}>
                {options.map((option, index) =>
                    <Clickable
                        key={index}
                        handleClick={() => handleSelect(option)}
                        alt={"option"}
                        text={option}
                    />
                )}
            </ListMenu>
        </BoxStyled>
    )
}

export default ComboMenu