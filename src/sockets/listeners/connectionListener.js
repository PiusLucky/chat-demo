export const socketConnectionListener = (
  socket,
  SocketEvents,
  setOnlineUsersAction,
  currentUser
) => {
  socket.on(SocketEvents.CONNECTION, () => {
    console.log("connected");
    socket.emit(SocketEvents.ONLINE, {
      id: currentUser.id,
      socketId: socket.id,
    });
  });
  socket.on(SocketEvents.USER_ONLINE, (data) => {
    setOnlineUsersAction(Object.keys(data));
  });
  return () => {
    socket.off(SocketEvents.USER_ONLINE, (data) => console.log(data));
  };
};
