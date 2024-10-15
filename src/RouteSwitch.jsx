import ErrorBoundary from "@shared/hooks/ErrorBoundary";
import React from "react";
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