export const notifyUserListener = (
  socket,
  SocketEvents,
  notificationMessage,
  setNotificationAction
) => {
  socket.on(SocketEvents.NOTIFY_USER, (data) => {
    if (notificationMessage[data.sender] === undefined) {
      let newNotification = {};
      newNotification[data.sender] = [data.message];
      setNotificationAction(newNotification);
    } else {
      let oldNotification = notificationMessage[data.sender];
      let updatedNotification = oldNotification.concat([data.message]);
      notificationMessage[data.sender] = updatedNotification;
      setNotificationAction(notificationMessage);
    }
  });
};
