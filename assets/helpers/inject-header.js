import AlertPopup from '../components/AlertPopup.js';
import NotificationItem from '../components/NotificationItem.js';
import loadIcons from '../helpers/load-icons.js';
import { getNotifications, updateNotificationAsRead } from './storage.js';

// injects the HTML string into the DOM
const injectHeader = (params) => {
  params.forEach((comp) => {
    const root = document.querySelector(comp?.target ?? '#root');

    if (!root) {
      console.error(`${comp?.target} element not found.`);
    } else {
      root.insertAdjacentHTML(
        comp?.position ?? 'beforeend',
        comp?.func(comp?.args)
      );
    }
  });
  loadIcons();

  const notifications = getNotifications();
  if (Array.isArray(notifications) && notifications.length) {
    const list = document.querySelector('#notifications-popup ul');

    checkIfAllNotificationsAreRead();

    if (list) {
      for (let i = 0; i < notifications.length; i++) {
        const element = notifications[i];
        displayNotificationItem(element);
      }
    }
  }

  if (markAllAsReadAction) {
    markAllAsReadAction.addEventListener('click', () => {
      const notifications = getNotifications();

      if (Array.isArray(notifications)) {
        notifications.forEach((notification) => {
          updateNotificationAsRead(notification.id);
        });

        const listItems = document.querySelectorAll(
          '#notifications-popup ul li'
        );

        listItems.forEach((item) => {
          item.classList.add('notification__item--read');
        });

        checkIfAllNotificationsAreRead();
      }
    });
  }
};

export const displayNotificationItem = (report) => {
  try {
    const list = document.querySelector('#notifications-popup ul');

    const listItem = new NotificationItem(report);

    const li = document.createElement('li');
    li.innerHTML = listItem.createItem();
    if (!!report.read) {
      li.classList.add('notification__item--read');
    }

    let insertedElement = null;
    if (list.childNodes.length) {
      insertedElement = list.insertBefore(li, list.childNodes[0]);
    } else {
      insertedElement = list.appendChild(listItem);
    }
    const detailsButton = insertedElement.querySelector(
      '.notification__body__button'
    );

    if (detailsButton) {
      detailsButton.addEventListener('click', () => {
        console.log('here');
        insertedElement.classList.add('notification__item--read');
        updateNotificationAsRead(report.id);
        window.location.replace(`/pages/home/index.html?${report.id}`);

        checkIfAllNotificationsAreRead();
      });
    }
  } catch (error) {
    const alert = new AlertPopup();
    alert.show('Error displaying notifications', AlertPopup.error);
  }
};

export const checkIfAllNotificationsAreRead = () => {
  const noNotificationsIcon = document.getElementById('no-notifications');
  const withNotificationsIcon = document.getElementById('with-notifications');

  const notifications = getNotifications();

  if (
    Array.isArray(notifications) &&
    noNotificationsIcon &&
    withNotificationsIcon
  ) {
    const readAll = notifications
      .map((n) => !!n.read)
      .every((value) => !!value);
    if (readAll) {
      noNotificationsIcon.classList.remove('hidden');
      withNotificationsIcon.classList.add('hidden');
    } else {
      noNotificationsIcon.classList.add('hidden');
      withNotificationsIcon.classList.remove('hidden');
    }
  }

  if (Array.isArray(notifications)) {
    const countElement = document.getElementById('notification-count');
    const count = notifications.filter((n) => !n.read).length;
    if (countElement) {
      countElement.innerHTML = `(${count})`;
    }
  }
};

export default injectHeader;
