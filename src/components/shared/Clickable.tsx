import { MouseEventHandler } from "react"
import withForwardedRefAndErrBoundary from "./hooks/withForwardedRef"
import { GenericWrapperWithRef } from "./types/sharedComponentTypes"

interface ClickableProps extends GenericWrapperWithRef {
    handleClick: MouseEventHandler<HTMLDivElement>,
    altText?: string,
    text: string
}

const Clickable: React.FC<ClickableProps> = ({ forwardedRef, handleClick, altText = "", text, children, ...props }) => {

    return (
        <div ref={forwardedRef} className="clickable" onClick={handleClick} {...props}>
            <p>{text}</p>
            {children}
        </div>
    )
}

export default withForwardedRefAndErrBoundary(Clickable)