import { MouseEventHandler } from "react"
import withForwardedRefAndErrBoundary from "../../services/hook/shared/withForwardedRef"
import { GenericWrapperWithRef } from "../../types/sharedComponentTypes"
import BoxStyled from "./BoxStyled"

interface ClickableProps extends GenericWrapperWithRef {
    handleClick: MouseEventHandler<HTMLDivElement>,
    altText?: string,
    text: string
}

const Clickable: React.FC<ClickableProps> = ({ forwardedRef, handleClick, altText = "", text, children, ...props }) => {

    return (
        <BoxStyled ref={forwardedRef} className="clickable" onClick={handleClick} {...props}>
            {text && <p>{text}</p>}
            {children}
        </BoxStyled>
    )
}

export default withForwardedRefAndErrBoundary(Clickable)