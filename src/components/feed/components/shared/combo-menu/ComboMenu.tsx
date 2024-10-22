import BoxStyled from "@/components/shared/BoxStyled";
import Clickable from "@/components/shared/Clickable";
import ListMenu from "@/components/shared/ListMenu";
import styles from "./styles/comboMenuStyles";


const ComboMenu = ({ options, selectedOption, textContent, handleSelect }) => {

    const classes = styles();

    return (
        <BoxStyled className={classes.wrapper}>
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