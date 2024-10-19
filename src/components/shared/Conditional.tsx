const Conditional = ({ isEnabled, children }) => {
    if (isEnabled) return <>{children}</>
    else return null;
}

export default Conditional