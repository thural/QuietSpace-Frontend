import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from 'react-dom/client';
import RouteSwitch from "./app/RouteSwitch";
import { getLocalThemeMode } from "./shared/utils/localStorageUtils";


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

const isDarkMode = getLocalThemeMode();
const colorScheme = isDarkMode ? "dark" : "light"

createRoot(document.getElementById('root')!).render(
    // <React.StrictMode>
    <QueryClientProvider client={queryClient}>
        <MantineProvider forceColorScheme={colorScheme}>
            <RouteSwitch />
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </MantineProvider>
    </QueryClientProvider>
    // </React.StrictMode>
)