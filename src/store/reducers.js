import Actions from "./actions";

const initState = {
  onlineUsers: [],
  userTyping: [],
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
    default:
      return state;
  }
};

export default reducer;
