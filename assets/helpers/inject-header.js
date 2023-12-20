import AlertPopup from '../components/AlertPopup.js';
import NotificationItem from '../components/NotificationItem.js';
import NotificationsEmpty from '../components/NotificationsEmpty.js';
import loadIcons from '../helpers/load-icons.js';
import Map from '../models/Map.js';
import { getNotifications, getUserSession, updateNotificationAsRead } from './storage.js';

const injectHeader = () => {
  const user = getUserSession();
  const showNavigation = !window.location.pathname.includes('/pages/login') && !window.location.pathname.includes('/pages/signup');

  const headerNav = document.getElementById('header-nav');
  if (headerNav && showNavigation) {
    if (user) {
      headerNav.innerHTML = `
          <div class="notification-container pointer">
          <span class="badge hidden"></span>
            <i id="no-notifications" class="icon-notification-no"  onclick="
                  const menu = document.querySelector('#notifications-popup');
                  document.querySelector('#header-menu').classList.add('hidden');
                  
                  if (menu.classList.contains('hidden')) { 
                      menu.classList.remove('hidden'); 
                      return; 
                  }; 
                  menu.classList.add('hidden');
  
                "></i>
            <i id="with-notifications" class="icon-notification-yes hidden"  onclick="
                  const menu = document.querySelector('#notifications-popup'); 
                  document.querySelector('#header-menu').classList.add('hidden');
  
                  if (menu.classList.contains('hidden')) { 
                    menu.classList.remove('hidden'); 
                    return; 
                  }; 
                  menu.classList.add('hidden');
                "></i>
          </div>
  
          <img
            id="avatar"
            class="pointer" 
            src="${user.photo || '../../assets/img/default-nav-image.png'}" alt="User logo"
            onerror="this.src = '../../assets/img/default-nav-image.png'"
            onclick="
            const menu = document.querySelector('#header-menu'); 
            document.querySelector('#notifications-popup').classList.add('hidden');
  
            if (menu.classList.contains('hidden')) { 
              menu.classList.remove('hidden'); 
              return; 
            }; 
            menu.classList.add('hidden');
            " />
          `;
    } else {
      headerNav.innerHTML = '<a href="/pages/login/index.html"><button id="header-login-button" class="btn btn-secondary text-body-3 medium">Log in</button></a>';
    }
  }

  const appHeader = document.getElementById('app-header');
  if (appHeader) {
    const headerMenu = document.createElement('nav');
    headerMenu.setAttribute('id', 'header-menu');
    headerMenu.classList.add('hidden');

    headerMenu.innerHTML = `
              <div class="header-menu__container">
              <ul>
                <li>
                    <div class="header-menu__container__premium">
                        <span>🏕️</span> 
                        <p class="text-body-2 text-neutral-700">Go Premium for Outsafe BC</p>
                    </div>
                </li>
                  <li class="text-body-2">
                    <a href="/pages/settings"><i class="icon-profile"></i> <span>Account Settings</span></a>
                  </li>
                  <li class="text-body-2">
                    <a href="/pages/my-reports"><i class="icon-reports"></i> <span>My Reports</span></a>
                  </li>
                  <li class="text-body-2">
                    <a href="/pages/logout/index.html"><i class="icon-logout"></i> <span>Logout</span></a>
                  </li>
              </ul>
            </div>
      `;

    const notificationsPopup = document.createElement('div');
    notificationsPopup.setAttribute('id', 'notifications-popup');
    notificationsPopup.classList.add('hidden');

    notificationsPopup.innerHTML = `
            <div class="notifications-popup__container">
              <div class="notifications-popup__header">
                <p class="text-body-1">Notifications <span id="notification-count"></span><p>
                <span aria-label="Close notifications panel" class="notification-popup__header__close pointer" onclick="const menu = document.querySelector('#notifications-popup'); menu.classList.add('hidden');" > <i class="icon-close-square"> </i></span>
              </div>
              <ul>
                
              </ul>
              <div id="empty-notifications"></div>
              <div id="markAllAsReadAction" class="notifications-popup__footer text-body-4 medium pointer">
                <i id="markAsReadIcon" class="icon-mark-as-read"></i> Mark all as read
              </div>
            </div>
      `;

    appHeader.appendChild(headerMenu);
    appHeader.appendChild(notificationsPopup);
    loadIcons();
  }

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

  const markAllAsReadAction = document.getElementById('markAllAsReadAction');
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
  const user = getUserSession();

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
