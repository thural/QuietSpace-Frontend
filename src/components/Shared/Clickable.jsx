
const Clickable = ({ handleClick = null, altText = "", text, children, ...props }) => {

    return (
        <div className="clickable" onClick={handleClick} alt={altText} {...props}>
            <p>{text}</p>
            {children}
        </div>
    )
}

export default Clickable