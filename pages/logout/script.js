import { clearUserSession } from '../../assets/helpers/storage.js';
import { clearPrevCenter } from '../../assets/helpers/prev-center.js';

clearUserSession();
clearPrevCenter();

window.location.replace('/pages/home');
