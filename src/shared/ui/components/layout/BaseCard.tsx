import { GenericWrapper } from "@shared-types/sharedComponentTypes";
import FlexStyled from "./FlexStyled";
import useStyles from "@/shared/styles/baseCardStyles"

const BaseCard: React.FC<GenericWrapper> = ({ children }) => {

    const classes = useStyles();

    return (
        <FlexStyled className={classes.baseCard}>{children}</FlexStyled>
    )
};

export default BaseCard;