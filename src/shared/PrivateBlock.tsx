import { Center } from "@mantine/core";
import { RxLockClosed } from "react-icons/rx";
import FlexStyled from "@/shared/FlexStyled";
import Typography, { TypographyProps } from "@/shared/Typography";
import styles from "@/styles/profile/privateBlockStyles";
import { GenericWrapper } from "@/types/sharedComponentTypes";

/**
 * PrivateBlockProps interface.
 * 
 * This interface defines the props for the PrivateBlock component.
 * 
 * @property {string} message - The message to display in the private block.
 * @property {React.ComponentType} [Icon] - An optional icon component to display alongside the message.
 */
export interface PrivateBlockProps extends TypographyProps, GenericWrapper {
    message: string;
    Icon?: React.ComponentType;
}

/**
 * PrivateBlock component.
 * 
 * This component renders a styled block indicating private content. It displays a message, 
 * an optional icon, and can accommodate additional children components. The default icon 
 * is a lock symbol, representing privacy. The component is centered and styled for visual 
 * clarity.
 * 
 * @param {PrivateBlockProps} props - The component props.
 * @returns {JSX.Element} - The rendered PrivateBlock component.
 */
const PrivateBlock: React.FC<PrivateBlockProps> = ({
    message = "private content",
    Icon = RxLockClosed,
    type = "h4",
    children,
    ...props
}) => {
    const classes = styles(); // Apply styles

    return (
        <Center {...props}> {/* Center the content */}
            <FlexStyled className={classes.privateBlock}>
                <Icon className={classes.icon} /> {/* Render the icon */}
                <FlexStyled className={classes.messageSection}>
                    <Typography className={classes.primaryMessage} type={type}>
                        {message} {/* Render the message */}
                    </Typography>
                    {children} {/* Render any additional children */}
                </FlexStyled>
            </FlexStyled>
        </Center>
    );
}

export default PrivateBlock;