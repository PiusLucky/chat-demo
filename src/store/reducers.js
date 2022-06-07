import Actions from "./actions";

const initState = {
  onlineUsers: [],
  userTyping: [],
  notificationMessage: {},
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case Actions.SET_ONLINE_USERS:
      return {
        ...state,
        onlineUsers: action.onlineUsers,
      };
    case Actions.SET_USERS_TYPING:
      return {
        ...state,
        userTyping: action.userTyping,
      };
    case Actions.SET_NOTIFICATION:
      console.log(state.notificationMessage, "here");
      return {
        ...state,
        notificationMessage: action.notificationMessage,
      };
    default:
      return state;
  }
};

export default reducer;
