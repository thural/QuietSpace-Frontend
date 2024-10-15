import withForwardedRef from "./hooks/withForwardedRef"

const Clickable = ({ forwardedRef, handleClick = null, altText = "", text, children, ...props }) => {

    return (
        <div ref={forwardedRef} className="clickable" onClick={handleClick} alt={altText} {...props}>
            <p>{text}</p>
            {children}
        </div>
    )
}

export default withForwardedRef(Clickable)