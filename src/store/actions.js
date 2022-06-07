const Actions = {
  SET_ONLINE_USERS: [],
  SET_USERS_TYPING: [],
  SET_NOTIFICATION: {},
};

export const setOnlineUsers = (onlineUsers) => {
  return {
    type: Actions.SET_ONLINE_USERS,
    onlineUsers,
  };
};

export const setUsersTyping = (userTyping) => {
  return {
    type: Actions.SET_USERS_TYPING,
    userTyping,
  };
};

export const setNotificationMessages = (notificationMessage) => {
  return {
    type: Actions.SET_NOTIFICATION,
    notificationMessage,
  };
};

export default Actions;
