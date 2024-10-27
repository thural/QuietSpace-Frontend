import { Center } from "@mantine/core"
import { RxLockClosed } from "react-icons/rx"
import FlexStyled from "@/components/shared/FlexStyled"
import Typography from "@/components/shared/Typography"
import styles from "./styles/privateBlockStyles"
import { GenericWrapper } from "@/components/shared/types/sharedComponentTypes"

const PrivateBlock: React.FC<GenericWrapper> = ({ message = "private content", Icon = RxLockClosed, children, ...props }) => {

    const classes = styles();

    return (
        <Center {...props}>
            <FlexStyled className={classes.privateBlock}>
                <Icon className={classes.icon} />
                <FlexStyled className={classes.messageSection}>
                    <Typography className={classes.primaryMessage} type="h4">{message}</Typography>
                    {children}
                </FlexStyled>
            </FlexStyled>
        </Center>
    )
}

export default PrivateBlock