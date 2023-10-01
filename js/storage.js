export const setUserSession = (user) => {
  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.debug(error);
  }
};

export const getUserSession = () => {
  try {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
  } catch (error) {
    console.debug(error);
    return {};
  }
};

export const clearUserSession = () => {
  try {
    localStorage.removeItem("user");
  } catch (error) {
    console.debug(error);
  }
};
