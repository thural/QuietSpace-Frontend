import React from "react";
import ReactDOM from "react-dom/client";
import RouteSwitch from "./RouteSwitch";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {MantineProvider} from "@mantine/core";


const queryCLient = new QueryClient({});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryCLient}>
        <MantineProvider>
      <RouteSwitch />
        </MantineProvider>
      <ReactQueryDevtools initialIsOpen={false} position="buttom-right"/>
    </QueryClientProvider>
  </React.StrictMode>
)