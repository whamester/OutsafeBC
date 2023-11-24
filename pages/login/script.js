import { API_URL, GOOGLE_ID } from '../../constants.js';
//Helpers
import {
  getUserSession,
  setUserSession,
} from '../../assets/helpers/storage.js';
//Components
import Header from '../../assets/components/Header.js';
import AlertPopup from '../../assets/components/AlertPopup.js';
import injectHeader from '../../assets/helpers/inject-header.js';
import LoaderAnimation from '../../assets/components/WhiteTransition.js';

//Variables
const password = document.getElementById('password-input');
const showPw = document.getElementById('show-pw');
const hidePw = document.getElementById('hide-pw');


//Loading animation (White overlay)
LoaderAnimation.initialize();
/**
 * Google Auth Setup
 */
window.onload = function () {
  // Inject Header
  injectHeader([
    { func: Header, target: '#login-body', position: 'afterbegin' },
  ]);

  const user = getUserSession();

  if (!!user?.id) {
    window.location.replace('/');
  }

  google.accounts.id.initialize({
    client_id: GOOGLE_ID,
    callback: async (googleResponse) => {
      try {
        const response = await fetch(`${API_URL}/auth?provider=google`, {
          method: 'POST',
          body: JSON.stringify(googleResponse),
        });

        const { data } = await response.json();

        if (data?.id) {
          AlertPopup.show('Welcome back!');
          setUserSession(data);
          window.location.replace('/');
          return;
        }

        AlertPopup.show(
          AlertPopup.SOMETHING_WENT_WRONG_MESSAGE,
          AlertPopup.error
        );
      } catch (error) {
        AlertPopup.show(
          AlertPopup.SOMETHING_WENT_WRONG_MESSAGE,
          AlertPopup.error
        );
        console.debug(error);
      }
    },
    use_fedcm_for_prompt: true,
  });
  google.accounts.id.renderButton(document.getElementById('google-button'), {
    theme: 'outline',
    size: 'large',
  });
  google.accounts.id.prompt();
};

/**
 * Login Submit
 */
document
  .getElementById('login-form')
  .addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
      const email = document.getElementById('email-input').value;
      const password = document.getElementById('password-input').value;

      const response = await fetch(`${API_URL}/auth`, {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const { data, error } = await response.json();

      if (data?.id) {
        AlertPopup.show('Welcome back!');

        setUserSession(data);
        window.location.replace('/');
      }

      if (!!error) {
        AlertPopup.show(error, AlertPopup.error);
      }
    } catch (error) {
      AlertPopup.show(
        AlertPopup.SOMETHING_WENT_WRONG_MESSAGE,
        AlertPopup.error
      );
      console.debug(error);
    }
  });

/**
 * Toggle Password Visibility
 */

showPw.addEventListener('click', showHideEyeIcon);
hidePw.addEventListener('click', showHideEyeIcon);

function showHideEyeIcon() {
  if (password.type === 'password') {
    password.type = 'text';
    hidePw.classList.remove('hidden');
    showPw.classList.add('hidden');
  } else {
    password.type = 'password';
    showPw.classList.remove('hidden');
    hidePw.classList.add('hidden');
  }
}
