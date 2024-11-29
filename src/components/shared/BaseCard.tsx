import { GenericWrapper } from "@/types/sharedComponentTypes";
import FlexStyled from "./FlexStyled";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
    baseCard: {
        alignItems: "center",
        background: "#e2e8f0",
        padding: ".5rem",
        borderRadius: "1.25rem",
    }
})

const BaseCard: React.FC<GenericWrapper> = ({ children }) => {

    const classes = useStyles();

    return (
        <FlexStyled className={classes.baseCard}>{children}</FlexStyled>
    )
};

export default BaseCard;