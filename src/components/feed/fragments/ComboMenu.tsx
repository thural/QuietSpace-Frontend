import BoxStyled from "@/components/shared/BoxStyled";
import Clickable from "@/components/shared/Clickable";
import ListMenu from "@/components/shared/ListMenu";
import styles from "@/styles/feed/comboMenuStyles";
import { ConsumerFn } from "@/types/genericTypes";

interface ComboMenu {
    options: Array<string>
    selectedOption: string
    textContent: string
    handleSelect: ConsumerFn
}

const ComboMenu: React.FC<ComboMenu> = ({ options, selectedOption, textContent, handleSelect }) => {

    const classes = styles();

    return (
        <BoxStyled className={classes.comboMenu}>
            <ListMenu styleUpdate={{}} menuIcon={selectedOption.concat(" ").concat(textContent)}>
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