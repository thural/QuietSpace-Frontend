import React from "react";
import ReactDOM from "react-dom/client";
import RouteSwitch from "./RouteSwitch";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"


const queryCLient = new QueryClient({});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryCLient}>
      <RouteSwitch />
      <ReactQueryDevtools initialIsOpen={false} position="buttom-right"/>
    </QueryClientProvider>
  </React.StrictMode>
)