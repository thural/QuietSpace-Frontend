import { GenericWrapper } from "./types/sharedComponentTypes";

const Conditional: React.FC<GenericWrapper> = ({ isEnabled, children }) => {
    if (isEnabled) return <>{children}</>
    else return null;
}

export default Conditional