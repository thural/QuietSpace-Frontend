import React from "react";
import ReactDOM from "react-dom/client";
import RouteSwitch from "./RouteSwitch";
import { Provider } from 'react-redux'
import { store } from "./redux/store"



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouteSwitch />
    </Provider>
  </React.StrictMode>
)