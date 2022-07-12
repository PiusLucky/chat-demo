export const userNotTypingEmitter = async (
  currentUser,
  id,
  socket,
  SocketEvents
) => {
  if (currentUser == null) return;
  const data = {
    sender: currentUser.id,
    receiver: id,
    status: false,
  };
  socket.emit(SocketEvents.NOTIFY_TYPING, data);
};
