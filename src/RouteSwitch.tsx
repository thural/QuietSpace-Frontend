import { BrowserRouter } from "react-router-dom";
import App from "./App";
import withErrorBoundary from "./services/hook/shared/withErrorBoundary";

const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    )
}

export default withErrorBoundary(RouteSwitch);