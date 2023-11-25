const PERSISTED_LOCATION_KEY = 'user-current-location';

export const getPersistedLocation = () => {
  const data = localStorage.getItem(PERSISTED_LOCATION_KEY);
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    return data;
  }
};

export const setPersistedLocation = (location) => {
  try {
    localStorage.setItem(PERSISTED_LOCATION_KEY, JSON.stringify(location));
  } catch (error) {
    console.error(error);
  }
};
