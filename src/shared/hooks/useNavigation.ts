import { useNavigate } from "react-router-dom";


const useNavigation = () => {
    const navigate = useNavigate();

    const navigatePath = (path: string) => {
        navigate(path);
    };

    return { navigatePath }
}

export default useNavigation