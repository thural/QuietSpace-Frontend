import withForwardedRefAndErrBoundary from "@/services/hook/shared/withForwardedRef"
import useStyles from "@/styles/shared/clickableStyles"
import { GenericWrapperWithRef } from "@/types/sharedComponentTypes"
import { MouseEventHandler } from "react"
import BoxStyled from "./BoxStyled"
import { MenuListStyleProps } from "./ListMenu"


interface ClickableProps extends GenericWrapperWithRef {
    handleClick: MouseEventHandler<HTMLDivElement>,
    styleProps?: MenuListStyleProps,
    altText?: string,
    text: string
}

const Clickable: React.FC<ClickableProps> = ({
    forwardedRef,
    handleClick,
    altText = "",
    text,
    styleProps,
    children,
    ...props
}) => {

    const classes = useStyles(styleProps);

    return (
        <BoxStyled ref={forwardedRef} className={classes.clickable} onClick={handleClick} {...props}>
            {text && <p>{text}</p>}
            {children}
        </BoxStyled>
    )
}

export default withForwardedRefAndErrBoundary(Clickable)