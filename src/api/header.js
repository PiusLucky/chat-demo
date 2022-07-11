export const header = (token = undefined) => {
  const params = {
    "Content-Type": "application/json",
  };
  if (token) {
    params["Authorization"] = `Bearer ${token}`;
  }

  return params;
};
