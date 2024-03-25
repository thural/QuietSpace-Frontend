import React from "react";
import ReactDOM from "react-dom/client";
import RouteSwitch from "./RouteSwitch";
import { Provider } from 'react-redux'
import { store } from "./redux/store"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"


const queryCLient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryCLient}>
      <Provider store={store}>
        <RouteSwitch />
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
)