
const Clickable = ({ handleClick = null, altText = "", text, children }) => {

    return (
        <div className="clickable" onClick={handleClick} alt={altText}>
            <p>{text}</p>
            {children}
        </div>
    )
}

export default Clickable