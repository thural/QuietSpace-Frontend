import PrivateBlock, { PrivateBlockProps } from "@/components/profile/shared/PrivateBlock";
import FlexStyled from "@/components/shared/FlexStyled";
import styles from "@/styles/chat/chatPlaceholderStyles";
import { JSXElementConstructor } from "react";

export interface PlaceholderProps extends PrivateBlockProps {
    message: string
    Icon: JSXElementConstructor<any>
}

const Placeholder: React.FC<PlaceholderProps> = ({ message, Icon, type = "h3" }) => {

    const classes = styles();

    return (
        <FlexStyled className={classes.chatboard}>
            <PrivateBlock Icon={Icon} message={message} type={type} />
        </FlexStyled>
    )
}

export default Placeholder