const Actions = {
  SET_ONLINE_USERS: [],
  SET_USERS_TYPING: [],
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

export default Actions;
