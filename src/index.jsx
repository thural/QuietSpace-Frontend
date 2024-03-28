import React from "react";
import ReactDOM from "react-dom/client";
import RouteSwitch from "./RouteSwitch";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"


const queryCLient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5 } // fetched data will be refreshed after 5 minutes
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryCLient}>
        <RouteSwitch />
    </QueryClientProvider>
  </React.StrictMode>
)