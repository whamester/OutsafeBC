import {
  checkIfAllNotificationsAreRead,
  displayNotificationItem,
} from './inject-header.js';
import loadIcons from './load-icons.js';
import { addNotification, getUserSession } from './storage.js';

// Enable pusher logging - don't include this in production
// Pusher.logToConsole = true;

var pusher = new Pusher('353ae3f7ae29d42e5749', {
  cluster: 'us3',
});

var channel = pusher.subscribe('reports-channel');
channel.bind('new-report', function (data) {
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
