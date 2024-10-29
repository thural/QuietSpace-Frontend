import { Center } from "@mantine/core"
import { RxLockClosed } from "react-icons/rx"
import FlexStyled from "@/components/shared/FlexStyled"
import Typography, { TypographyProps } from "@/components/shared/Typography"
import styles from "./styles/privateBlockStyles"
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes"
import { JSXElementConstructor } from "react"

export interface PrivateBlockProps extends TypographyProps, GenericWrapper {
    message: string,
    Icon: JSXElementConstructor<any>
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