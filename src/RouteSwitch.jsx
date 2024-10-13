import React from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorBoundary from "./components/Shared/hooks/ErrorBoundary";

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