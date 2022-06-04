export const saveLoggedUser = (user) => {
  window.localStorage.clear();
  window.localStorage.setItem("user", JSON.stringify(user));
};

export const getLoggedUser = () => {
  return JSON.parse(window.localStorage.getItem("user"));
};
