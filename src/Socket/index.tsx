import { io } from "socket.io-client";

const URL = "https://api.it-hub.agency";

const SocketIO = io(URL, {
  transports: ["websocket"],
});

export default SocketIO;
