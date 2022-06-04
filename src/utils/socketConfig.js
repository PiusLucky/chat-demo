import io from "socket.io-client";

const SERVER = process.env.REACT_APP_BASE_WS_URL;
let socket = null;

export const socketConn = () => {
  if (socket == null) {
    return (socket = io(SERVER));
  } else {
    return socket;
  }
};
