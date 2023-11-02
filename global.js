import errorInputHelper from './assets/helpers/error-input-helper.js';
import loadIcons from './assets/helpers/load-icons.js';

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

    beamsClient
      .start()
      .then((beamsClient) => beamsClient.getDeviceId())
      .then((deviceId) =>
        console.log('Successfully registered with Beams. Device ID:', deviceId)
      )
      .then(() => beamsClient.addDeviceInterest('all'))
      .then(() => beamsClient.getDeviceInterests())
      .then((interests) => console.log('Current interests:', interests))
      .catch(console.error);
  });
}

loadIcons();

errorInputHelper();
