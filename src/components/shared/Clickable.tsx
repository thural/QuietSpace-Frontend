import withForwardedRef from "./hooks/withForwardedRef"
import { GenericWrapperWithRef } from "./types/sharedComponentTypes"

const Clickable: React.FC<GenericWrapperWithRef> = ({ forwardedRef, handleClick = null, altText = "", text, children, ...props }) => {

    return (
        <div ref={forwardedRef} className="clickable" onClick={handleClick} {...props}>
            <p>{text}</p>
            {children}
        </div>
    )
}

export default withForwardedRef(Clickable)