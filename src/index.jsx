import React from "react";
import ReactDOM from "react-dom/client";
import RouteSwitch from "./RouteSwitch";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"


const queryClient = new QueryClient({});

//TODO: remove after kubernetes service tests

// fetch("http://locahost:8080/hello")
//     .then(response => response.json())
//     .then(data => {
//         // Handle the data here
//         console.log( "http://locahost:8080/hello",data);
//     }).catch(err => console.log(err));

// fetch("http://backend-service:8080/hello")
//     .then(response => response.json())
//     .then(data => {
//         // Handle the data here
//         console.log( "http://backend-service:8080/hello",data);
//     }).catch(err => console.log(err));

// fetch("http://backend-service/hello")
//     .then(response => response.json())
//     .then(data => {
//         // Handle the data here
//         console.log( "http://backend-service/hello",data);
//     }).catch(err => console.log(err));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouteSwitch />
            <ReactQueryDevtools initialIsOpen={false} position="buttom-right"/>
        </QueryClientProvider>
    </React.StrictMode>
)