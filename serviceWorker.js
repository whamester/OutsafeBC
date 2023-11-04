import { getUserSession } from './assets/helpers/storage.js';

self.addEventListener('install', (event) => {
  // console.log("Service worker installed",event)
});

// lister for activate service worker event
self.addEventListener('activate', async (event) => {
  // console.log("Service worker activated",event)
});

self.addEventListener('fetch', (event) => {
  // console.log('[FETCH]', event)
});

self.addEventListener('push', function (event) {
  if (event.data) {
    console.log('Push event!! ', event.data.json());
    const { notification, data } = event.data.json();

    const user = getUserSession();

    if (!!user?.notifications_enabled) {
      self.registration.showNotification(notification.title, {
        body: notification.body,
        tag: data.id,
        icon: '../assets/img/icons/logo-square.png', //TODO: Replace image with our logo
      });
    }
  } else {
    console.log('Push event but no data');
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = `https://hilarious-cat-da30a3.netlify.app/pages/home/index.html?id=${event.notification.tag}`;

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
      })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow(url);
      })
  );
});
