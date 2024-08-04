import sockjs from "sockjs-client/dist/sockjs"
import { over } from "stompjs";

export const useSocket = () => {

    const createSubscription = (path, callbackFn) => {
        const socket = new sockjs('/ws');

        const stompClient = over(socket);

        stompClient.connect({}, function (frame) {
            console.log(frame);

            stompClient.subscribe(path, function (result) {
                callbackFn(JSON.parse(result.body));
            });

        });

        return stompClient;
    }


    const sendMessage = (subscription, destination, body) => {
        subscription.send(destination, {}, JSON.stringify(body));
    }


    return { createSubscription, sendMessage };
}