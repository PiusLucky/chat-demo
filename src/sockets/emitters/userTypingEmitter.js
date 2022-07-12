export const userTypingEmitter = (currentUser, id, socket, SocketEvents) => {
  if (currentUser == null) return;
  const data = {
    sender: currentUser.id,
    receiver: id,
    status: true,
  };
  socket.emit(SocketEvents.NOTIFY_TYPING, data);
};
