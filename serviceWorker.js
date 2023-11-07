self.addEventListener('install', (event) => {
  // console.log("Service worker installed",event)
});

// lister for activate service worker event
self.addEventListener('activate', async (event) => {
  // console.log("Service worker activated",event)
});

self.addEventListener('fetch', (event) => {});

self.addEventListener('push', function (event) {
  if (event.data) {
    console.log('Push event!! ', event.data.json());
    const { notification, data } = event.data.json();
    try {
      self.registration.showNotification(notification.title, {
        body: notification.body,
        tag: `${data.id}---${new Date().getTime()}`,
        icon: '../assets/img/icons/logo-square.png', //TODO: Replace image with our logo
      });

      const channel = new BroadcastChannel('new-report-created');
      channel.postMessage({ ...data });
    } catch (error) {
      console.log({ error });
    }
  } else {
    console.log('Push event but no data');
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  try {
    const id = event.notification.tag?.split('---')?.[0];
    const url = `https://hilarious-cat-da30a3.netlify.app/pages/home/index.html?id=${id}`;

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
  } catch (error) {
    console.log(error);
  }
});
