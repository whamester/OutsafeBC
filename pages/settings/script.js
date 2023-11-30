import { API_URL } from '../../constants.js';
// Helpers
import readImage from '../../assets/helpers/read-image.js';
import { getUserSession, setUserSession, updateUserSession } from '../../assets/helpers/storage.js';
import injectHeader from '../../assets/helpers/inject-header.js';
// Components
import Header from '../../assets/components/Header.js';
import AlertPopup from '../../assets/components/AlertPopup.js';
import Modal from '../../assets/components/Modal.js';

// Variables
const user = getUserSession();
const inputFile = document.getElementById('inputImage');
const uploadImageBtn = document.getElementById('uploadImageBtn');
const deleteAccountBtn = document.getElementById('deleteAccountBtn');
const deleteImageBtn = document.getElementById('deleteImageBtn');
const nameField = document.getElementById('name');
const emailField = document.getElementById('email');
const basicInfoSettings = document.getElementById('basicInfoSettings');
const changePasswordSettings = document.getElementById('changePasswordSettings');
const notificationsSettings = document.getElementById('notificationsSettings');
const securitySettings = document.getElementById('securitySettings');
const dropdownMenu = document.getElementById('dropdownMenu');
let userID = user?.id;
let picture;
let changedFields = {
  name: false,
  photo: false,
};

/**
 * Page Init
 */
window.onload = function () {
  injectHeader([{ func: Header, target: '#profile-body', position: 'afterbegin' }]);
  basicInfoSettings.style.display = 'flex';

  showProfilePic(user?.photo || undefined, true);
};

nameField.addEventListener('input', () => {
  changedFields.name = true;
});

inputFile.addEventListener('input', () => {
  changedFields.photo = true;
});

// SPA for sections
const settingsMap = {
  basicInfoOptn: basicInfoSettings,
  passwordOptn: changePasswordSettings,
  notificationsOtp: notificationsSettings,
  securityOtn: securitySettings,
};

let currentSelectedOption = null;

function toggleSettingsDisplay(selectedSetting) {
  for (const settingsElement of Object.values(settingsMap)) {
    settingsElement.style.display = 'none';
  }

  if (selectedSetting) {
    selectedSetting.style.display = 'flex';
  }
}

// Set the initial selected option to the first option in the dropdown
const initialOption = dropdownMenu.options[0].value;
dropdownMenu.value = initialOption;

// Initialize the state based on the initially selected option
currentSelectedOption = initialOption;
updateActiveButton(); // This will add the 'active' class to the corresponding button
toggleSettingsDisplay(settingsMap[initialOption]);

// Dropdown menu
dropdownMenu.addEventListener('change', () => {
  const selectedSettings = settingsMap[dropdownMenu.value];
  currentSelectedOption = dropdownMenu.value;
  toggleSettingsDisplay(selectedSettings);
  updateActiveButton();
});

// Side menu
function setupSideMenuButton(btnId, settingKey) {
  const button = document.getElementById(btnId);

  // Add a click event listener to each side menu button
  button.addEventListener('click', function () {
    dropdownMenu.value = settingKey; // Set the dropdown value
    const selectedSettings = settingsMap[settingKey];
    currentSelectedOption = settingKey;
    toggleSettingsDisplay(selectedSettings);
    updateActiveButton();
    toggleButton(btnId); // Add 'active' class to the clicked button
  });
}

function updateActiveButton() {
  var buttons = document.querySelectorAll('.account-settings__menu-btn');
  buttons.forEach(function (button) {
    button.classList.remove('active');
  });

  const activeButton = document.getElementById(currentSelectedOption);
  if (activeButton) {
    activeButton.classList.add('active');
  } else {
    // If no active button is found, default to the first button
    const defaultButton = document.getElementById('basicInfoBtn'); // Adjust the ID accordingly
    if (defaultButton) {
      defaultButton.classList.add('active');
      currentSelectedOption = 'basicInfoOptn'; // Set the corresponding setting key
    }
  }
}

// Initialize the state based on the currently selected option
updateActiveButton();

// Setup side menu buttons
setupSideMenuButton('basicInfoBtn', 'basicInfoOptn');
setupSideMenuButton('passwordBtn', 'passwordOptn');
setupSideMenuButton('notificationsBtn', 'notificationsOtp');
setupSideMenuButton('securityBtn', 'securityOtn');

function toggleButton(btnId) {
  var buttons = document.querySelectorAll('.account-settings__menu-btn');
  buttons.forEach(function (button) {
    button.classList.remove('active');
  });
  document.getElementById(btnId).classList.add('active');
}

//Show user information
function showUserInfo() {
  if (!!user) {
    nameField.setAttribute('value', user?.name);
    emailField.setAttribute('value', user?.email);
    return;
  }

  window.location.replace('/');
}

showUserInfo();

function clearDirtyField() {
  changedFields.name = false;
  changedFields.photo = false;
}

// Change user information
saveProfileInfoBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  if (changedFields.name) {
    await saveUserInfo();
    return;
  }
});

// Save user information
async function saveUserInfo(photo = undefined) {
  try {
    const name = nameField.value;

    const response = await fetch(`${API_URL}/user?id=${userID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        photo,
      }),
    });
    const { data, error, message } = await response.json();

    if (!!error) {
      console.error(error);
      return;
    }

    if (data) {
      setUserSession({
        ...user,
        ...data,
      });

      showHideDeleteImageBtn(data?.photo);
      showProfilePic(data?.photo, true);

      AlertPopup.show(`${!!changedFields.name ? 'Name' : 'Image'} has been saved`);
      console.log(message);

      clearDirtyField();
    }
  } catch (error) {
    AlertPopup.show(AlertPopup.SOMETHING_WENT_WRONG_MESSAGE, AlertPopup.error);
    console.log('user name error', error);
  }
}

// Change password
function togglePwModal() {
  const pwModal = resetPwPopup.style;
  pwModal.display = pwModal.display === 'block' ? 'none' : 'block';
}

resetPwBtn.addEventListener('click', togglePwModal);

// Profile photo
function showProfilePic(url = '../../assets/img/default-nav-image.png', withTimestamp = false) {
  const src = withTimestamp ? `${url}?t=${new Date().getTime()}` : url;
  profilePhoto.setAttribute('src', src);
  document.getElementById('avatar').setAttribute('src', src);
}

inputFile.addEventListener('change', loadImage);

function loadImage() {
  picture = inputFile.files[0];

  readImage(picture, ({ target }) => {
    showProfilePic(target.result);
  });
}

uploadImageBtn.addEventListener('change', (e) => {
  e.preventDefault();
  loadImage();
  uploadImage();
});

async function uploadImage() {
  const result = await saveProfilePicture();
  await saveUserInfo(result.data.url);
}

async function saveProfilePicture() {
  try {
    const response = await fetch(`${API_URL}/user-image?userId=${userID}.${picture?.type?.replace('image/', '')}`, {
      method: 'POST',
      headers: {
        'Content-Type': picture.type,
      },
      body: picture,
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log('picture upload error', error);
    return null;
  }
}

function showHideDeleteImageBtn(photo) {
  if (photo) {
    deleteImageBtn.setAttribute('style', 'display: flex;');
  } else {
    deleteImageBtn.setAttribute('style', 'display: none;');
  }
}
showHideDeleteImageBtn(user?.photo);

// Delete user image
deleteImageBtn.addEventListener('click', deleteProfilePicture);

async function deleteProfilePicture() {
  try {
    const name = nameField.value;
    const photo = '';

    const response = await fetch(`${API_URL}/user?id=${userID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        photo,
      }),
    });
    const { data, error, message } = await response.json();

    if (!!error) {
      console.error(error);
      return;
    }

    if (data) {
      setUserSession({
        ...user,
        ...data,
      });

      showProfilePic();
      showHideDeleteImageBtn();

      AlertPopup.show(`Image has been deleted`);
    }
  } catch (error) {
    AlertPopup.show(AlertPopup.SOMETHING_WENT_WRONG_MESSAGE, AlertPopup.error);
  }
}

// Delete profile
deleteAccountBtn.addEventListener('click', () => {
  const modal = new Modal();

  const div = document.createElement('div');
  div.setAttribute('class', 'btn-container');
  const cancelBtn = document.createElement('button');
  cancelBtn.setAttribute('id', 'cancel-modal-btn');
  cancelBtn.setAttribute('class', 'btn btn-secondary');
  cancelBtn.addEventListener('click', () => {
    modal.close();
  });
  cancelBtn.innerHTML = 'Cancel';

  const delBtn = document.createElement('button');
  delBtn.setAttribute('id', 'delete-modal-btn');
  delBtn.setAttribute('class', 'btn btn-error');
  delBtn.addEventListener('click', () => {
    deleteAccount();
  });
  delBtn.innerHTML = 'Delete Account';
  div.appendChild(cancelBtn);
  div.appendChild(delBtn);

  modal.show({
    title: 'Delete Account?',
    description: 'Hey! We’re sorry to see you go. Are you sure you want to delete your account? This can’t be undone.',
    icon: {
      name: 'icon-exclamation-mark',
      color: '#D42621',
      size: '3.5rem',
    },
    actions: div,
    enableOverlayClickClose: true,
  });
});

async function deleteAccount() {
  try {
    const response = await fetch(`${API_URL}/user`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user.auth),
    });

    const { error, data, message } = await response.json();

    if (!!error) {
      console.error(error);
      return;
    }

    AlertPopup.show('Account deleted successfully');

    window.location.replace('/pages/logout');
  } catch (error) {
    AlertPopup.show(AlertPopup.SOMETHING_WENT_WRONG_MESSAGE, AlertPopup.error);
  }
}

// Update settings

// Check status of push notification setting
async function getNotificationSettings() {
  try {
    const response = await fetch(`${API_URL}/notification?user_id=${userID}`);
    const result = await response.json();
    let status = result.data.is_enabled;

    if (status) {
      pushNotificationSwitch.checked = true;
    } else {
      pushNotificationSwitch.checked = false;
    }
  } catch (error) {
    console.log('Unable to get notification status', error);
  }
}

getNotificationSettings();

// Toggle push notification setting
async function setNotificationSettings() {
  try {
    if (!userID) {
      return;
    }
    const response = await fetch(`${API_URL}/notification?user_id=${userID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        is_enabled: !!pushNotificationSwitch.checked,
      }),
    });

    const { error, data, message } = await response.json();

    if (!!error) {
      console.error(error);
      return;
    }

    updateUserSession({
      notifications_enabled: !!pushNotificationSwitch.checked,
    });

    AlertPopup.show(`Notifications turned ${!!pushNotificationSwitch.checked ? 'on' : 'off'}`);
  } catch (error) {
    AlertPopup.show(AlertPopup.SOMETHING_WENT_WRONG_MESSAGE, AlertPopup.error);
  }
}

pushNotificationSwitch.addEventListener('change', setNotificationSettings);
