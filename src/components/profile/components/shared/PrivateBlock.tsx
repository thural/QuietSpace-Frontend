import { Center } from "@mantine/core"
import { RxLockClosed } from "react-icons/rx"
import FlexStyled from "@shared/FlexStyled"
import Typography from "@shared/Typography"
import styles from "./styles/privateBlockStyles"

const PrivateBlock = ({ message = "private content", Icon = RxLockClosed, children, ...props }) => {

    const classes = styles();

    return (
        <Center {...props}>
            <FlexStyled class={classes.privateBlock}>
                <Icon class={classes.icon} />
                <FlexStyled class={classes.messageSection}>
                    <Typography class={classes.primaryMessage} type="h4">{message}</Typography>
                    {children}
                </FlexStyled>
            </FlexStyled>
        </Center>
    )
}

export default PrivateBlock