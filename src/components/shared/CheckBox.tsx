import { ResId } from "@/api/schemas/native/common";
import { ConsumerFn } from "@/types/genericTypes";
import BoxStyled from "./BoxStyled";
import styles from "@/styles/shared/checkboxStyles"


interface CheckBoxProps {
    value: ResId
    onChange: ConsumerFn
}

const CheckBox: React.FC<CheckBoxProps> = ({ value, onChange }) => {

    const classes = styles();

    const handleSelectClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
    }

    return (
        <BoxStyled className={classes.wrapper}>
            <input
                className={classes.roundedCheckbox}
                onClick={handleSelectClick}
                type="checkbox"
                value={value}
                onChange={onChange}
            />
        </BoxStyled>
    );
};

export default CheckBox