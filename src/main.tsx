import { createRoot } from 'react-dom/client';
import RouteSwitch from "./app/RouteSwitch";


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

createRoot(document.getElementById('root')!).render(
    // <React.StrictMode>
    <RouteSwitch />
    // </React.StrictMode>
)