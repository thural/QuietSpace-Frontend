import { GenericWrapper } from "@/types/sharedComponentTypes";
import FlexStyled from "./FlexStyled";
import useStyles from "@/styles/shared/baseCardStyles"

const BaseCard: React.FC<GenericWrapper> = ({ children }) => {

    const classes = useStyles();

    return (
        <FlexStyled className={classes.baseCard}>{children}</FlexStyled>
    )
};

export default BaseCard;