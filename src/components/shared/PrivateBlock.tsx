import { Center } from "@mantine/core"
import { RxLockClosed } from "react-icons/rx"
import FlexStyled from "@/components/shared/FlexStyled"
import Typography, { TypographyProps } from "@/components/shared/Typography"
import styles from "@/styles/profile/privateBlockStyles"
import { GenericWrapper } from "@/types/sharedComponentTypes"

export interface PrivateBlockProps extends TypographyProps, GenericWrapper {
    message: string,
    Icon?: React.ComponentType
}

const PrivateBlock: React.FC<PrivateBlockProps> = ({ message = "private content", Icon = RxLockClosed, type = "h4", children, ...props }) => {

    const classes = styles();

    return (
        <Center {...props}>
            <FlexStyled className={classes.privateBlock}>
                <Icon className={classes.icon} />
                <FlexStyled className={classes.messageSection}>
                    <Typography className={classes.primaryMessage} type={type}>{message}</Typography>
                    {children}
                </FlexStyled>
            </FlexStyled>
        </Center>
    )
}

export default PrivateBlock