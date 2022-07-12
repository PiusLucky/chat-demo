export const joinRoomEmitter = (id, socket, SocketEvents, currentUser) => {
  const data = {
    owner: id,
    guest: currentUser.id.toString(),
  };

  socket.emit(SocketEvents.JOINROOM, data);
};
