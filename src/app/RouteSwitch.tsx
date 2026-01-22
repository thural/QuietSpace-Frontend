import { BrowserRouter } from "react-router-dom";
import App from "./App";
import withErrorBoundary from "@/shared/hooks/withErrorBoundary";

const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}

export default withErrorBoundary(RouteSwitch);