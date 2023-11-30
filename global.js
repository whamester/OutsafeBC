import AlertPopup from './assets/components/AlertPopup.js';
import errorInputHelper from './assets/helpers/error-input-helper.js';
import { checkIfAllNotificationsAreRead, displayNotificationItem } from './assets/helpers/inject-header.js';
import loadIcons from './assets/helpers/load-icons.js';
import { addNotification, getUserSession } from './assets/helpers/storage.js';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/serviceWorker.js')
    .then((reg) => {
      console.log('Service worker registered', reg);
    })
    .catch((err) => {
      console.log('Service worker not registered', err);
    });

  Notification.requestPermission()
    .then((permission) => {
      console.log(permission);
    })
    .catch((error) => {
      console.log(error);
    });

  navigator.serviceWorker.ready.then((registration) => {
    console.log(`A service worker is active: ${registration.active}`);

    const beamsClient = new PusherPushNotifications.Client({
      instanceId: 'db0b4e69-d055-47b5-a8bf-784a5157b8d6',
      serviceWorkerRegistration: registration,
    });

    const user = getUserSession();

    beamsClient
      .start()
      .then((beamsClient) => beamsClient.getDeviceId())
      .then((deviceId) => console.log('Successfully registered with Beams. Device ID:', deviceId))
      .then((data) => (user?.notifications_enabled ? beamsClient.addDeviceInterest(user?.id) : data))
      .then(() => beamsClient.removeDeviceInterest('all'))
      .then(() => beamsClient.getDeviceInterests())
      .then((data) => (!user ? beamsClient.clearDeviceInterests() : data))
      .then((interests) => console.log('Current interests:', interests))
      .catch(console.error);
  });
}

const channel = new BroadcastChannel('new-report-created');
channel.addEventListener('message', (event) => {
  console.log('Received', event.data);

  const data = event.data;
  const user = getUserSession();
  if (!!user && user.email !== data?.user?.email) {
    addNotification(user.id, { ...data, read: false });
    displayNotificationItem({ ...data, read: false });
    checkIfAllNotificationsAreRead();
    loadIcons();
    const emptyDiv = document.getElementById('empty-notifications');
    emptyDiv.innerHTML = '';
  }
});

loadIcons();

errorInputHelper();

const showOfflineAlert = () => {
  AlertPopup.show(
    'You are offline right now. You can still view recent hazard reports, but to receive real-time updates, please connect to the internet. Stay safe out there! 🏕️🌲',
    AlertPopup.warning,
    -1,
    AlertPopup.bottom_center,
    true
  );
};

window.addEventListener('load', () => {
  if (!window.navigator.onLine) {
    showOfflineAlert();
  }
});

window.addEventListener('offline', function () {
  showOfflineAlert();
});

window.addEventListener('online', function () {
  AlertPopup.show('You are back online', AlertPopup.success);
});
