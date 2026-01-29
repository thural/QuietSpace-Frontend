import withForwardedRefAndErrBoundary from "@/shared/hooks/withForwardedRef"
import useStyles from "@/shared/styles/clickableStyles"
import { GenericWrapperWithRef } from "@shared-types/sharedComponentTypes"
import { MouseEventHandler } from "react"
import { Container } from '@/shared/ui/components/layout/Container';
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
        <Container ref={forwardedRef} className={classes.clickable} onClick={handleClick} {...props}>
            {text && <p>{text}</p>}
            {children}
        </Container>
    )
}

export default withForwardedRefAndErrBoundary(Clickable)