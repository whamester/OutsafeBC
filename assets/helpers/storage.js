//USER
export const setUserSession = (user) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.debug(error);
  }
};

export const getUserSession = () => {
  try {
    const user = localStorage.getItem('user');
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
    localStorage.removeItem('user');
  } catch (error) {
    console.debug(error);
  }
};

//NOTIFICATIONS

export const addNotification = (data) => {
  try {
    const notifications = getNotifications();
    if (Array.isArray(notifications)) {
      localStorage.setItem(
        'notifications',
        JSON.stringify([...notifications.splice(0, 4), data])
      );
    } else {
      localStorage.setItem('notifications', JSON.stringify([data]));
    }
  } catch (error) {
    console.debug(error);
  }
};

export const updateNotificationAsRead = (id) => {
  try {
    const notifications = getNotifications();
    if (Array.isArray(notifications)) {
      localStorage.setItem(
        'notifications',
        JSON.stringify(
          notifications.map((n) => ({
            ...n,
            read: id === n.id ? true : n.read,
          }))
        )
      );
    }
  } catch (error) {
    console.debug(error);
  }
};

export const getNotifications = () => {
  try {
    const notifications = localStorage.getItem('notifications');
    if (notifications) {
      return JSON.parse(notifications);
    }
  } catch (error) {
    console.debug(error);
    return {};
  }
};
