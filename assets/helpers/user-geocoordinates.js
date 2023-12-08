const USER_LOCATION_KEY = 'user_location';

export const setUserLocation = (data) => {
  try {
    localStorage.setItem(USER_LOCATION_KEY, JSON.stringify(data));
  } catch (error) {
    console.error(error);
  }
};

export const getUserLocation = (key) => {
  try {
    let data = localStorage.getItem(USER_LOCATION_KEY);
    data = data ? JSON.parse(data) : {};
    return key ? data[key] : data;
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const clearUserLocation = () => {
  try {
    localStorage.removeItem(USER_LOCATION_KEY);
  } catch (error) {
    console.error(error);
  }
};
