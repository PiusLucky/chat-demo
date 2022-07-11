export const joinRoomEmitter = (
  id,
  socket,
  SocketEvents,
  messagesContainer,
  currentUser
) => {
  const data = {
    owner: id,
    guest: currentUser.id.toString(),
  };

  socket.emit(SocketEvents.JOINROOM, data);
  return () => {
    console.log("message.current === null", messagesContainer.current);
    if (messagesContainer.current === null) {
      socket.emit(SocketEvents.LEAVEROOM, data);
    }
  };
};
