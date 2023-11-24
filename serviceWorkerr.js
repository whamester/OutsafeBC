const STATIC_RESOURCES_KEY = 'static-resources-5';
const APP_RESOURCES_KEY = 'app-resources-5';

const API_REQUESTS_KEY = 'api-requests-5';

const ICONS = [
  'assets/icons/search.svg',
  'assets/icons/checkmark.svg',
  'assets/icons/wildlife-filled.svg',
  'assets/icons/circle-check-filled.svg',
  'assets/icons/password-visible.svg',
  'assets/icons/location-pin-fill-red.svg',
  'assets/icons/distance.svg',
  'assets/icons/logout.svg',
  'assets/icons/location-pin-fill.svg',
  'assets/icons/photo-placeholder.svg',
  'assets/icons/mark-as-read.svg',
  'assets/icons/map.svg',
  'assets/icons/report-submitted.svg',
  'assets/icons/checkbox-checked.svg',
  'assets/icons/reports.svg',
  'assets/icons/location-pin-outline.svg',
  'assets/icons/arrow-right.svg',
  'assets/icons/subscribe.svg',
  'assets/icons/settings.svg',
  'assets/icons/insects-outline.svg',
  'assets/icons/time.svg',
  'assets/icons/add-pin.svg',
  'assets/icons/filters.svg',
  'assets/icons/circle-check.svg',
  'assets/icons/weather-outline.svg',
  'assets/icons/flag.svg',
  'assets/icons/plus.svg',
  'assets/icons/check.svg',
  'assets/icons/warning.svg',
  'assets/icons/email.svg',
  'assets/icons/checkbox-unchecked.svg',
  'assets/icons/close.svg',
  'assets/icons/infrastructure-outline.svg',
  'assets/icons/wildfire-outline.svg',
  'assets/icons/exclamation-mark.svg',
  'assets/icons/camera.svg',
  'assets/icons/wildfire-filled.svg',
  'assets/icons/edit.svg',
  'assets/icons/wildlife-outline.svg',
  'assets/icons/delete.svg',
  'assets/icons/update-status.svg',
  'assets/icons/plants-outline.svg',
  'assets/icons/profile.svg',
  'assets/icons/share.svg',
  'assets/icons/remove.svg',
  'assets/icons/marker/icon-insects.svg',
  'assets/icons/marker/icon-wildfire.svg',
  'assets/icons/marker/icon-wildfire-focused.svg',
  'assets/icons/marker/icon-weather.svg',
  'assets/icons/marker/icon-wildlife.svg',
  'assets/icons/marker/icon-plants-focused.svg',
  'assets/icons/marker/icon-wildlife-focused.svg',
  'assets/icons/marker/icon-infrastructure.svg',
  'assets/icons/marker/icon-plants.svg',
  'assets/icons/marker/icon-weather-focused.svg',
  'assets/icons/marker/icon-infrastructure-focused.svg',
  'assets/icons/marker/icon-insects-focused.svg',
  'assets/icons/current-location.svg',
  'assets/icons/current-location-active.svg',
  'assets/icons/close-square.svg',
  'assets/icons/date.svg',
  'assets/icons/password-close.svg',
  'assets/icons/notification-yes.svg',
  'assets/icons/notification-no.svg',
  'assets/icons/plants-filled.svg',
  'assets/icons/dangerous-insects-filled.svg',
  'assets/icons/minus.svg',
  'assets/icons/chevron-left.svg',
];

const ASSETS = [
  '/index.html',
  '/global.js',
  '/constants.js',
  '/pages/home/index.html',

  '/assets/css/_global.css',
  '/assets/css/_typography.css',
  '/assets/css/_fonts.css',
  '/assets/css/_variables.css',
  '/assets/css/icon.css',
  '/assets/css/input.css',
  '/assets/css/checkbox.css',
  '/assets/css/badge.css',
  '/assets/css/modal.css',
  '/assets/css/alert-popup.css',
  '/assets/css/button.css',
  '/assets/css/white-transition.css',
  '/assets/css/header.css',
  '/assets/css/notification-item.css',

  '/assets/img/notifications-empty.svg',
  '/assets/img/header-logo-light.svg',
  '/assets/img/default-nav-image.png',

  '/assets/img/icons/logo-square.png',
  '/assets/img/icons/appicon-128.svg',
  '/assets/img/icons/appicon-72.png',
  '/assets/img/icons/appicon-72.svg',
  '/assets/img/icons/appicon-128.png',
  '/assets/img/icons/appicon-96.svg',
  '/assets/img/icons/appicon-256.png',
  '/assets/img/icons/appicon-256.svg',
  '/assets/img/icons/appicon-96.png',
  '/assets/img/header-logo-dark.svg',

  ...ICONS,

  '/assets/fonts/Instrument_Sans/static/InstrumentSans-Italic.ttf',
  '/assets/fonts/Instrument_Sans/static/InstrumentSans_SemiCondensed-BoldItalic.ttf',
  '/assets/fonts/Instrument_Sans/static/InstrumentSans_SemiCondensed-Regular.ttf',
  '/assets/fonts/Instrument_Sans/static/InstrumentSans_SemiCondensed-Medium.ttf',
  '/assets/fonts/Instrument_Sans/static/InstrumentSans_SemiCondensed-SemiBoldItalic.ttf',
  '/assets/fonts/Instrument_Sans/static/InstrumentSans_SemiCondensed-SemiBold.ttf',
  '/assets/fonts/Instrument_Sans/static/InstrumentSans_Condensed-Medium.ttf',
  '/assets/fonts/Instrument_Sans/static/InstrumentSans-MediumItalic.ttf',
  '/assets/fonts/Instrument_Sans/static/InstrumentSans-BoldItalic.ttf',
  '/assets/fonts/Instrument_Sans/static/InstrumentSans_SemiCondensed-MediumItalic.ttf',
  '/assets/fonts/Instrument_Sans/static/InstrumentSans-SemiBoldItalic.ttf',
  '/assets/fonts/Instrument_Sans/static/InstrumentSans_Condensed-Bold.ttf',
  '/assets/fonts/Instrument_Sans/static/InstrumentSans-Regular.ttf',
  '/assets/fonts/Instrument_Sans/static/InstrumentSans_SemiCondensed-Italic.ttf',
  '/assets/fonts/Instrument_Sans/static/InstrumentSans_Condensed-SemiBoldItalic.ttf',
  '/assets/fonts/Instrument_Sans/static/InstrumentSans_Condensed-SemiBold.ttf',
  '/assets/fonts/Instrument_Sans/static/InstrumentSans_Condensed-BoldItalic.ttf',
  '/assets/fonts/Instrument_Sans/static/InstrumentSans_Condensed-Regular.ttf',
  '/assets/fonts/Instrument_Sans/static/InstrumentSans_SemiCondensed-Bold.ttf',
  '/assets/fonts/Instrument_Sans/static/InstrumentSans_Condensed-Italic.ttf',
  '/assets/fonts/Instrument_Sans/static/InstrumentSans_Condensed-MediumItalic.ttf',
  '/assets/fonts/Instrument_Sans/static/InstrumentSans-SemiBold.ttf',
  '/assets/fonts/Instrument_Sans/static/InstrumentSans-Medium.ttf',
  '/assets/fonts/Instrument_Sans/static/InstrumentSans-Bold.ttf',

  '/modules/leaflet/leaflet.js',
  '/modules/leaflet/images/layers.png',
  '/modules/leaflet/images/marker-icon.png',
  '/modules/leaflet/images/marker-icon-2x.png',
  '/modules/leaflet/images/marker-shadow.png',
  '/modules/leaflet/images/layers-2x.png',
  '/modules/leaflet/leaflet-src.esm.js',
  '/modules/leaflet/leaflet-src.esm.js.map',
  '/modules/leaflet/leaflet.js.map',
  '/modules/leaflet/leaflet-src.js.map',
  '/modules/leaflet/leaflet.css',
  '/modules/leaflet/leaflet-src.js',

  'https://www.gstatic.com/firebasejs/ui/6.0.1/firebase-ui-auth.js',
  'https://www.gstatic.com/firebasejs/ui/6.0.1/firebase-ui-auth.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_RESOURCES_KEY).then((cache) => {
      cache.addAll(ASSETS);
    })
  );

  self.skipWaiting();
  console.log('service worker installed');
});

// lister for activate service worker event
self.addEventListener('activate', async (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      console.log({ keys });
      return Promise.all(keys.filter((key) => key !== STATIC_RESOURCES_KEY).map((key) => caches.delete(key)));
    })
  );

  self.clients.claim();
  console.log('service worker activate');
});

const API_REQUESTS_URLS = ['https://outsafebc-api.netlify.app'];
const APP_BLACKLIST = ['https://outsafebc-api.netlify.app', '/jawg-terrain', 'chrome-extension://'];

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cache) => {
      const isAPIRequest = !!API_REQUESTS_URLS.find((url) => event.request.url.includes(url)) && event.request.method === 'GET';
      if (isAPIRequest) {
        caches.open(API_REQUESTS_KEY).then((cache) => cache.add(event.request).catch(console.error));
      }

      // console.log({ isAPIRequest, cache });
      if (cache && isAPIRequest) {
        fetch(event.request).then((response) =>
          caches
            .open(API_REQUESTS_KEY)
            .then((cache) => {
              cache.put(event.request, response.clone()).catch(console.error);

              return response;
            })
            .catch(console.log)
        );
      }

      return (
        cache ||
        fetch(event.request)
          .then(async (response) => {
            return caches
              .open(APP_RESOURCES_KEY)
              .then((cache) => {
                if (!APP_BLACKLIST.find((url) => event.request.url.includes(url)) && event.request.method === 'GET') {
                  cache.put(event.request, response.clone()).catch(console.error);
                }
                return response;
              })
              .catch(console.log);
          })
          .catch(console.log)
      );
    })
  );
});

self.addEventListener('push', function (event) {
  if (event.data) {
    console.log('Push event!! ', event.data.json());
    const { notification, data } = event.data.json();
    try {
      self.registration.showNotification(notification.title, {
        body: notification.body,
        tag: `${data.id}---${new Date().getTime()}`,
        icon: '../assets/img/icons/logo-square.png',
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
    const url = `https://outsafebc.ca/pages/home/index.html?id=${id}&open=true`;

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
