import { Loader } from "@/shared/ui/components"

const LoaderStyled = ({ color = "gray", size = 30 }) => {
    return (
        <Loader color={color} size={size} />
    );
}

export default LoaderStyled