import ErrorBoundary from "./components/shared/hooks/ErrorBoundary.tsx";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </BrowserRouter>
    )
}

export default RouteSwitch