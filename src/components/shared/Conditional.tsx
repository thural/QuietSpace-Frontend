import { GenericWrapper } from "../../types/sharedComponentTypes";

export interface Conditional extends GenericWrapper {
    isEnabled: boolean
}

const Conditional: React.FC<Conditional> = ({ isEnabled, children }) => {
    if (isEnabled) return <>{children}</>
    else return null;
}

export default Conditional