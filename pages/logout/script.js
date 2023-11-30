import { clearUserSession } from '../../assets/helpers/storage.js';
import { clearPrevCenter } from '../../assets/helpers/prev-center.js';

window.onload = () => {
  clearUserSession();
  clearPrevCenter();

  window.location.assign('/pages/home/index.html');
};
