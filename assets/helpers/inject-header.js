import AlertPopup from '../components/AlertPopup.js';
import NotificationItem from '../components/NotificationItem.js';
import NotificationsEmpty from '../components/NotificationsEmpty.js';
import loadIcons from '../helpers/load-icons.js';
import Map from '../models/Map.js';
import injectHTML from './inject-html.js';
import { getNotifications, getUserSession, updateNotificationAsRead } from './storage.js';

const user = getUserSession();

const injectHeader = (params) => {
  injectHTML(params);

  const notifications = user ? getNotifications(user.id) : [];

  const list = document.querySelector('#notifications-popup ul');

  checkIfAllNotificationsAreRead();

  if (list) {
    if (!notifications?.length) {
      const emptyDiv = document.getElementById('empty-notifications');
      const empty = new NotificationsEmpty();
      emptyDiv.innerHTML = empty.getHTML();

      disableMarkAllAsRead();
      return;
    }

    if (Array.isArray(notifications)) {
      for (let i = 0; i < notifications.length; i++) {
        const element = notifications[i];
        displayNotificationItem(element);
      }
    }
  }

  if (markAllAsReadAction) {
    markAllAsReadAction.addEventListener('click', () => {
      const notifications = user ? getNotifications(user.id) : [];

      if (Array.isArray(notifications)) {
        notifications.forEach((notification) => {
          updateNotificationAsRead(user.id, notification.id);
        });

        const listItems = document.querySelectorAll('#notifications-popup ul li');

        listItems.forEach((item) => {
          item.classList.add('notification__item--read');
        });

        checkIfAllNotificationsAreRead();
      }

      disableMarkAllAsRead();
    });
  }

  loadIcons();
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
    const detailsButton = insertedElement.querySelector('.notification__body__button');

    if (detailsButton) {
      detailsButton.addEventListener('click', () => {
        insertedElement.classList.add('notification__item--read');
        updateNotificationAsRead(user.id, report.id);
        window.location.replace(`/pages/home/index.html?id=${report.id}&open=true&zoom=${Map.FOCUSED_MAP_ZOOM}&lat=${report.location.lat}&lng=${report.location.lng}`);

        checkIfAllNotificationsAreRead();
      });
    }
  } catch (error) {
    AlertPopup.show('Error displaying notifications', AlertPopup.error);
  }
};

export const checkIfAllNotificationsAreRead = () => {
  const noNotificationsIcon = document.getElementById('no-notifications');
  const badge = document.querySelector('.badge');

  const notifications = user ? getNotifications(user.id) : [];

  if (Array.isArray(notifications) && noNotificationsIcon && badge) {
    const readAll = notifications.map((n) => !!n.read).every((value) => !!value);

    if (readAll) {
      disableMarkAllAsRead();
      badge.classList.add('hidden');
    } else {
      enableMarkAllAsRead();
      badge.classList.remove('hidden');
    }
  }

  if (Array.isArray(notifications)) {
    const countElement = document.getElementById('notification-count');
    const count = notifications.filter((n) => !n.read).length;
    if (countElement) {
      countElement.innerHTML = count > 0 ? `(${count})` : '';
    }
  }
};

export const disableMarkAllAsRead = () => {
  try {
    markAllAsReadAction?.classList?.add('text-neutral-400');
    markAllAsReadAction?.classList?.remove('text-neutral-900');
    markAllAsReadAction.style.cursor = 'auto';
    markAsReadIcon.style.backgroundColor = 'var(--neutral-400)';
  } catch (error) {
    console.error(error);
  }
};

export const enableMarkAllAsRead = () => {
  try {
    markAllAsReadAction?.classList?.add('text-neutral-900');
    markAllAsReadAction?.classList?.remove('text-neutral-400');
    markAllAsReadAction.style.cursor = 'pointer';
    markAsReadIcon.style.backgroundColor = 'var(--neutral-900)';
  } catch (error) {
    console.error(error);
  }
};

export default injectHeader;
