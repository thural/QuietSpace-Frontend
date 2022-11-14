import React from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";

const RouteSwitch = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

export default RouteSwitch