import React from "react";
import ReactDOM from "react-dom/client";
import RouteSwitch from "./RouteSwitch";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {MantineProvider} from "@mantine/core";
import UserService from "./hooks/UserService";


const queryCLient = new QueryClient({});

const root = ReactDOM.createRoot(document.getElementById('root'));

const renderApp = () => root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryCLient}>
        <MantineProvider>
      <RouteSwitch />
        </MantineProvider>
      <ReactQueryDevtools initialIsOpen={false} position="buttom-right"/>
    </QueryClientProvider>
  </React.StrictMode>
)

UserService.initKeycloak(renderApp)