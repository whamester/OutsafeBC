//Models
import ReportForm from '../../assets/models/ReportForm.js';
import Map from '../../assets/models/Map.js';

//Constants
import { API_URL } from '../../constants.js';

//Components
import Header from '../../assets/components/Header.js';
import AlertPopup from '../../assets/components/AlertPopup.js';
import Modal from '../../assets/components/Modal.js';
import LoaderAnimation from '../../assets/components/WhiteTransition.js';

//Helpers
import { getUserSession } from '../../assets/helpers/storage.js';
import readImage from '../../assets/helpers/read-image.js';
import geocode from '../../assets/helpers/geocode.js';
import injectHeader from '../../assets/helpers/inject-header.js';
import { showButtonLoading, stopButtonLoading } from '../../assets/helpers/set-action-button.js';

//Variable Declaration
const url = new URL(window.location.href);
const idReport = url.searchParams.get('id');
const latitude = Number(url.searchParams.get('lat')) || null;
const longitude = Number(url.searchParams.get('lng')) || null;

let currentReport = new ReportForm();
let position = latitude && longitude ? { lat: latitude, lng: longitude } : Map.DEFAULT_LOCATION;

let mapInstance = null;
let skipHazardOption = false;
const user = getUserSession();

let allowRedirect = false;

const STEPS = {
  location: '#select-location',
  category: '#hazard-category',
  hazard: '#hazard-type',
  comments: '#additional-details',
  images: '#upload-photos',
  review: '#review-report',
};

const STEPS_LABEL = {
  location: 'Select Location',
  category: 'Hazard Category',
  hazard: 'Hazard Type',
  comments: 'Additional Details',
  images: 'Upload Photos',
  review: 'Review Report',
};

/**
 * Page Init
 */

//Loading animation (White overlay)
LoaderAnimation.initialize();

//to display the correct section
window.onload = async function () {
  try {
    if (!user) {
      window.location.replace('/');
      return;
    }

    if (idReport) {
      window.location.hash = '#review-report';
    } else {
      window.location.hash = '#select-location';
    }

    injectHeader([{ func: Header, target: '#report-hazard-body', position: 'afterbegin' }]);

    displayCurrentSection();
    window.addEventListener('hashchange', displayCurrentSection);

    getCategories();

    if (!idReport) {
      // Loads the map even if the user has not accepted the permissions
      mapInstance = new Map(position.lat, position.lng, { MAP_ZOOM: Map.REPORT_HAZARD_MAP_ZOOM });
      mapInstance.setMarkerOnMap(position.lat, position.lng, {
        draggable: true,
      });
      if (mapInstance) {
        mapInstance.map.on('click', onSelectLocation);
      }
      loadGeolocation();
    } else {
      populateReport(idReport);
    }

    document.getElementById('mapZoomIn').addEventListener('click', () => {
      mapInstance.map.zoomIn();
    });

    document.getElementById('mapZoomOut').addEventListener('click', () => {
      mapInstance.map.zoomOut();
    });
  } catch (error) {
    console.error({ error });
    AlertPopup.show(error.message || AlertPopup.SOMETHING_WENT_WRONG_MESSAGE, AlertPopup.error, 500);
  }
};

// Event listener for the 'beforeunload' event
window.addEventListener('beforeunload', function (e) {
  const values = [currentReport.category.id, currentReport.comment, currentReport.images.length, currentReport.option.id];

  if (values.some((value) => !!value) && !allowRedirect) {
    e.preventDefault();
    e.returnValue = '';
  }
});

const updateCurrentReportLocation = async (params) => {
  const address = await getAddressFromCoordinates(params);

  currentReport.location = {
    lat: params.lat,
    lng: params.lng,
    address: address,
  };

  locationAddressLabel.innerHTML = `${currentReport.location.address ? currentReport.location.address : `(${currentReport.location.lat}, ${currentReport.location.lng})`}`;
};

const displayCurrentSection = () => {
  try {
    let pageId = location.hash ? location.hash : '#select-location';
    if (skipHazardOption && location.hash === '#hazard-type') {
      window.location.hash = '#additional-details';
    }

    if (skipHazardOption && location.hash === '#review-report') {
      document.getElementById('review-report-category').classList.add('hidden');
    }

    pagesHandler(pageId);

    if (pageId === STEPS.review) {
      if (!!idReport) {
        continueBtnText.innerHTML = 'Update Report';
      } else {
        continueBtnText.innerHTML = 'Submit Report';
      }
    } else {
      continueBtnText.innerHTML = 'Continue';
    }

    const fullNavMenu = document.getElementById('fullNavMenu');
    const main = document.querySelector('main');
    if (pageId === STEPS.location) {
      fullNavMenu.classList.add('hidden');
    } else {
      fullNavMenu.classList.remove('hidden');
    }

    if (pageId === STEPS.location && idReport && !mapInstance) {
      // Display the position of the report location
      mapInstance = new Map(currentReport.location.lat, currentReport.location.lng, { MAP_ZOOM: Map.REPORT_HAZARD_MAP_ZOOM });
      mapInstance.setRelativeMarkerOnMap(currentReport.location.lat, currentReport.location.lng, {
        draggable: true,
      });

      if (mapInstance) {
        mapInstance.map.on('click', onSelectLocation);
      }
    }

    continueBtnContainer.style.boxShadow = 'none';

    document.body.scrollTop = document.documentElement.scrollTop = 0;

    generateBreadcrumb();
  } catch (error) {
    console.error({ error });
    AlertPopup.show(error.message || AlertPopup.SOMETHING_WENT_WRONG_MESSAGE, AlertPopup.error);
  }
};

const pagesHandler = (pageId = '#select-location') => {
  const allPages = document.querySelectorAll('section.page');

  for (let page of allPages) {
    if (pageId === '#' + page.id) {
      page.style.display = 'flex';
    } else {
      page.style.display = 'none';
    }
  }
};

const loadGeolocation = async () => {
  try {
    // position = await Map.getCurrentLocation();
    await updateCurrentReportLocation(position);
    mapInstance.setMarkerOnMap(position.lat, position.lng, {
      draggable: true,
    });
    // mapInstance.map.flyTo([position.lat, position.lng], FLY_TO_ZOOM);
  } catch (error) {
    console.error(error);

    AlertPopup.show(error.message || AlertPopup.SOMETHING_WENT_WRONG_MESSAGE, AlertPopup.error);
  }
};

const populateReport = async (id) => {
  if (id !== null) {
    const getSingleReport = async () => {
      try {
        let response = await fetch(`${API_URL}/hazard-report?id=${id}`);
        let { data } = await response.json();

        const editReport = new ReportForm();
        editReport.category = {
          id: data.hazardCategory.id,
          name: data.hazardCategory.name,
        };

        editReport.option = {
          id: data.hazard.id,
          name: data.hazard.name,
        };

        editReport.location = {
          lat: data.location.lat,
          lng: data.location.lng,
          address: data.location.address,
        };

        editReport.comment = data.comment;

        editReport.images = data.images;

        displayReviewStepInfo(editReport);

        setFormValues(editReport);

        currentReport = { ...editReport };
      } catch (error) {
        console.error({ error });

        AlertPopup.show(error.message || AlertPopup.SOMETHING_WENT_WRONG_MESSAGE, AlertPopup.error, 6000);
      }
    };

    getSingleReport();
  }
};

const getAddressFromCoordinates = async (params) => {
  try {
    const data = await geocode(params, 'reverse-geocode');

    const properties = data?.[0].properties;
    const address = [properties?.address_line1, properties?.address_line2].filter((value) => !!value).join(' ');

    return address;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Step 1: Location
 */

const onSelectLocation = async (event) => {
  mapInstance.setRelativeMarkerOnMap(event.latlng.lat, event.latlng.lng, {
    draggable: true,
  });
  await updateCurrentReportLocation(event.latlng);
};

/**
 * Step 2: Category List
 */

const getCategories = async () => {
  try {
    let response = await fetch(`${API_URL}/hazard-category`);
    let { data } = await response.json();
    const content = document.getElementById('hazard-category-content-list');

    let arrayIcons = [];

    data.forEach((category) => {
      if (category.name && category.ui_settings.icon) {
        const iconParts = category.ui_settings.icon.toLowerCase().split('-');
        if (iconParts.length >= 2) {
          arrayIcons.push(iconParts[1]);
        }
      }
    });

    for (let i = 0; i < data.length; i++) {
      const category = data[i];

      const categoryContainer = document.createElement('div');
      categoryContainer.classList.add('category-container');

      const radio = document.createElement('input');

      radio.setAttribute('type', 'radio');
      radio.setAttribute('name', 'categoryRadioBtn');
      radio.setAttribute('id', `category-${category.id}-radio`);
      radio.setAttribute('value', category.id);
      radio.addEventListener('change', (event) => {
        skipHazardOption = false;

        currentReport.option.id = null;
        currentReport.option.name = null;

        const selectedCategoryId = event.target.value;
        const selectedCategory = data.find((category) => category.id === selectedCategoryId);
        currentReport.category.id = selectedCategoryId;
        currentReport.category.name = category.name;

        const options = selectedCategory.options ?? [];
        const selectedOptionQuestion = selectedCategory.ui_settings.report_hazard_question ?? [];

        populateHazardOptions(options, selectedOptionQuestion);

        const allNewIcons = document.querySelectorAll('.orange-check-icon');
        allNewIcons.forEach((newIcon) => {
          newIcon.style.display = 'none';
        });

        const selectedLabel = document.querySelector(`label[for=${radio.id}]`);
        const newIcon = selectedLabel.querySelector('.orange-check-icon');
        if (newIcon) {
          newIcon.style.display = 'block';
        }
      });

      const label = document.createElement('label');

      label.setAttribute('id', `category-${category.id}-label`);
      label.setAttribute('for', `category-${category.id}-radio`);
      label.classList.add('label-container');
      label.innerHTML = `<img class="category-icon" src="../../assets/icons/${arrayIcons[i]}-outline.svg" alt="${arrayIcons[i]}">`;

      const textContainer = document.createElement('div');
      textContainer.classList.add('text-container');

      const categoryName = document.createElement('p');
      categoryName.innerHTML = category.name;
      categoryName.classList.add('title-hazard');
      categoryName.classList.add('text-body-1');
      categoryName.classList.add('bold');

      const categoryDescription = document.createElement('p');
      categoryDescription.innerHTML = category.description;
      categoryDescription.classList.add('description-hazard');
      categoryDescription.classList.add('text-body-3');
      categoryDescription.classList.add('medium');

      textContainer.appendChild(categoryName);
      textContainer.appendChild(categoryDescription);

      label.appendChild(textContainer);

      const newIcon = document.createElement('img');
      newIcon.setAttribute('src', '../../assets/icons/circle-check-filled.svg');
      newIcon.setAttribute('alt', 'circle-check-filled');
      newIcon.classList.add('orange-check-icon');
      newIcon.style.display = 'none';
      label.appendChild(newIcon);

      categoryContainer.appendChild(radio);
      categoryContainer.appendChild(label);

      content.appendChild(categoryContainer);
    }

    const savedCategory = document.getElementById(`category-${currentReport.category.id}-radio`);
    if (idReport && savedCategory) {
      savedCategory.click();
    }

    const savedOption = document.getElementById(`option-${currentReport.option.id}-radio`);
    if (idReport && savedOption) {
      savedOption.click();
    }
  } catch (error) {
    console.error({ error });

    AlertPopup.show(error.message || AlertPopup.SOMETHING_WENT_WRONG_MESSAGE, AlertPopup.error);
  }
};

/**
 * Step 3: Hazard Options List
 */

const populateHazardOptions = (options, selectedOptionQuestion) => {
  try {
    const hazardOptionContent = document.getElementById('hazard-option-content');
    const selectedOptionId = currentReport.option.id;

    hazardOptionContent.innerHTML = '';

    if (options.length === 1) {
      currentReport.option.id = options[0].id;
      currentReport.option.name = options[0].name;
      skipHazardOption = true;
    }

    document.getElementById('hazardTypeQuestion').innerHTML = selectedOptionQuestion;

    for (let i = 0; i < options.length; i++) {
      const option = options[i];

      const div = document.createElement('div');
      div.classList.add('div-input');
      const radio = document.createElement('input');

      radio.setAttribute('type', 'radio');
      radio.setAttribute('name', 'optionRadioBtn');
      radio.setAttribute('id', `option-${option.id}-radio`);
      radio.setAttribute('value', option.id);

      radio.addEventListener('change', (event) => {
        currentReport.option.id = event.target.value;
        currentReport.option.name = option.name;

        // Call populateHazardOptions again to redraw all options
        populateHazardOptions(options, selectedOptionQuestion);
      });

      const label = document.createElement('label');
      label.setAttribute('id', `option-${option.id}-label`);
      label.setAttribute('for', `option-${option.id}-radio`);

      const divContainer = document.createElement('div');
      divContainer.classList.add('container-type');

      const div1Icon = document.createElement('div');
      div1Icon.innerHTML = '<img class="category-icon-type" src="../../assets/icons/checkmark.svg" style="display: none">';
      div1Icon.classList.add('checkmark');

      const div2Text = document.createElement('div');
      div2Text.innerHTML = option.name;
      div2Text.classList.add('text-type');
      div2Text.classList.add('text-body-1');
      div2Text.classList.add('medium');

      divContainer.appendChild(div1Icon);
      divContainer.appendChild(div2Text);

      label.appendChild(divContainer);

      div.appendChild(radio);
      div.appendChild(label);

      hazardOptionContent.appendChild(div);

      // Highlight the selected option
      if (option.id === selectedOptionId) {
        label.style.backgroundColor = 'your-selected-color';
        label.style.borderColor = 'your-selected-border-color';
        div1Icon.style.display = 'block';
      }
    }
  } catch (error) {
    console.error({ error });
    AlertPopup.show(error.message || AlertPopup.SOMETHING_WENT_WRONG_MESSAGE, AlertPopup.error);
  }
};


/**
 * Step 4: Comments
 */
commentInput.addEventListener('change', (event) => {
  currentReport.comment = event.target.value;
});

/**
 * Step 5: Images
 */

//Checking if the user is accessing through a mobile browser or a desktop browser
function checkMobileDevice() {
  if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  ) {
    document.getElementById('upload-photos-desktop-content').style.display = 'none';
  } else {
    document.getElementById('upload-photos-mobile-content').style.display = 'none';
  }
}

checkMobileDevice();

//#region Desktop Images
const video = document.getElementById('video');
const canvasArea = document.getElementById('canvasArea');

const canvasContext = canvasArea.getContext('2d');
canvasContext.scale(0.5, 0.5);

//Open and close the camera on a desktop browser if the device has a camera
document.getElementById('starCameraBtn').addEventListener('click', () => {
  if (currentReport.images.length >= 3) {
    return;
  }
  document.getElementById('displayCameraArea').style.display = 'flex';
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const mediaPromise = navigator.mediaDevices.getUserMedia({ video: true });
    mediaPromise.then((stream) => {
      video.srcObject = stream;

      document.getElementById('starCameraBtn').disabled = true;
      document.getElementById('stopCameraBtn').disabled = false;
    });
    mediaPromise.catch((error) => {
      console.error(error);
      canvasContext.font = '20px Tahoma';
      canvasContext.fillText(error, 20, 100);

      AlertPopup.show('Error taking the picture', AlertPopup.warning);
    });
    document.getElementById('takeDesktopPictureBtn').disabled = false;
  } else {
    AlertPopup.show("This browser doesn't support media devices", AlertPopup.warning);
  }
});

const stopCamera = () => {
  try {
    document.getElementById('displayCameraArea').style.display = 'none';
    if (video) {
      const tracks = video?.srcObject?.getTracks();
      if (Array.isArray(tracks)) {
        tracks.forEach((track) => track.stop());
      }
    }

    document.getElementById('starCameraBtn').disabled = false;
    document.getElementById('stopCameraBtn').disabled = true;
    document.getElementById('takeDesktopPictureBtn').disabled = true;
  } catch (error) {
    console.error(error);
  }
};
document.getElementById('stopCameraBtn').addEventListener('click', stopCamera);

document.getElementById('takeDesktopPictureBtn').addEventListener('click', () => {
  if (currentReport.images.length < 3) {
    canvasContext.drawImage(video, 0, 0);
    const canvasDataURL = canvasArea.toDataURL();

    displayImages(canvasDataURL);
  } else {
    AlertPopup.show('You have reached the limit of pictures allowed', AlertPopup.warning);
  }
});

//Click to upload a picture
const fileInput = document.getElementById('uploadPictureDesktopInput');
fileInput.addEventListener('click', stopCamera);
fileInput.addEventListener('change', function () {
  saveFile(Object.values(this.files));
});

//Drag and drop to upload picture
const dragAndDropArea = document.getElementById('dragAndDropArea');

dragAndDropArea.addEventListener('dragover', (event) => {
  event.preventDefault();
  dragAndDropArea.classList.add('active');
});

dragAndDropArea.addEventListener('dragleave', () => {
  dragAndDropArea.classList.remove('active');
});

dragAndDropArea.addEventListener('drop', (event) => {
  event.preventDefault();
  dragAndDropArea.classList.remove('active');
  saveFile(Object.values(event.dataTransfer.files));
});

//#endregion

//#region  Mobile Images
const takeMobilePictureBtnInput = document.getElementById('takeMobilePictureBtn');
const uploadPictureMobileInput = document.getElementById('uploadPictureMobileInput');
takeMobilePictureBtnInput.addEventListener('change', handleFileSelection);
uploadPictureMobileInput.addEventListener('change', handleFileSelection);

function handleFileSelection(event) {
  const selectedFiles = event.target.files;
  saveFile([...selectedFiles]);
}

//#endregion

//#region Mobile and Desktop Image Functions
const saveFile = (files) => {
  if (currentReport.images.length >= 3) {
    AlertPopup.show('You have reached the limit of pictures allowed', AlertPopup.warning);
    return;
  }
  const selectedFiles = Array.isArray(files) ? files : [files];

  if (selectedFiles.length > 3) {
    AlertPopup.show('You can only upload 3 images', AlertPopup.warning);
  }
  selectedFiles?.splice(0, 3)?.forEach((file) => {
    try {
      readImage(file, ({ target }) => {
        displayImages(target.result);
      });
    } catch (error) {
      AlertPopup.show('Error uploading the image', AlertPopup.warning);
    }
  });
};

const displayImages = (base64File) => {
  const imagesArea = document.getElementById('displayImagesArea');
  let divNumber = -1;

  for (let i = 1; i <= 3; i++) {
    if (currentReport.images2.indexOf(`picture-${i}`) === -1) {
      divNumber = i;
      break;
    }
  }

  const img = document.createElement('img');
  img.setAttribute('src', base64File);

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.classList.add('delete-button');
  deleteButton.addEventListener('click', function () {
    imagesArea.querySelector(`.picture-${divNumber}`).removeChild(img);
    imagesArea.querySelector(`.picture-${divNumber}`).removeChild(deleteButton);

    imagesArea.querySelector(`.hide-picture-${divNumber}`).style.display = 'flex';

    const hidePicture = imagesArea.querySelector(`.hide-picture-${divNumber}`);
    hidePicture.style.display = 'block';
    hidePicture.style.display = 'flex';
    hidePicture.style.alignItems = 'center';
    hidePicture.style.justifyContent = 'center';
    hidePicture.style.width = '100%';
    hidePicture.style.height = '100%';

    const index = currentReport.images2.indexOf(`picture-${divNumber}`);
    if (index !== -1) {
      currentReport.images.splice(index, 1);
      currentReport.images2.splice(index, 1);
    }

    if (currentReport.images2.length < 3) {
      document.getElementById('starCameraBtn').removeAttribute('disabled');
      document.getElementById('dragAndDropArea').removeAttribute('disabled');
      document.getElementById('uploadPictureDesktopInput').removeAttribute('disabled');
    }

    if (currentReport.images2.length === 2) {
      startCamera();
    }
  });

  deleteButton.style.background = `url('../../assets/icons/remove.svg') no-repeat center`;
  deleteButton.style.border = 'none';

  imagesArea.querySelector(`.hide-picture-${divNumber}`).style.display = 'none';
  imagesArea.querySelector(`.picture-${divNumber}`).appendChild(img);
  imagesArea.querySelector(`.picture-${divNumber}`).appendChild(deleteButton);

  currentReport.images2.push(`picture-${divNumber}`);
  currentReport.images.push(base64File);

  if (currentReport.images2.length === 3) {
    document.getElementById('starCameraBtn').setAttribute('disabled', true);
    document.getElementById('dragAndDropArea').setAttribute('disabled', true);
    document.getElementById('uploadPictureDesktopInput').setAttribute('disabled', true);

    stopCamera();
  }
};

const getEmptyImages = () => {
  const emptyImages = document.createElement('p');
  emptyImages.classList.add('submit-value', 'text-body-2', 'regular', 'w-full');
  emptyImages.innerHTML = 'No images added';

  return emptyImages;
};
//#endregion

/**
 *  Back Button
 */

document.getElementById('b_ckButton').addEventListener('click', () => {
  const url = new URL(window.location.href);

  const allSteps = ['#select-location', '#hazard-category', '#hazard-type', '#additional-details', '#upload-photos', '#review-report'];

  const array = allSteps.filter((hash) => (skipHazardOption ? hash !== '#hazard-type' : true));
  const currentHash = url.hash;

  const currentIndex = array.indexOf(currentHash);

  if (currentIndex === 0) {
    window.location.replace('/pages/home/index.html');
    return;
  }

  const previousIndex = currentIndex - 1;
  const previousHash = array[previousIndex];

  url.hash = previousHash;
  window.location.href = url.href;
});

/**
 *  Close Buttons
 */

document.getElementById('closeButton').addEventListener('click', () => {
  window.location.replace('/pages/home/index.html');
});

document.getElementById('desktopBackButton').addEventListener('click', () => {
  window.location.replace('/pages/home/index.html');
});

/**
 *  Continue Button
 */
document.getElementById('continueBtn').addEventListener('click', async () => {
  const allSteps = Object.values(STEPS);

  const array = allSteps.filter((hash) => (skipHazardOption ? hash !== STEPS.hazard : true));

  const url = new URL(window.location.href);
  const currentHash = url.hash;

  const currentIndex = array.indexOf(currentHash);

  if (currentHash === STEPS.category && !currentReport.category.id) {
    AlertPopup.show('Please select a hazard category', AlertPopup.warning);

    return;
  }

  if (currentHash === STEPS.hazard && !currentReport.option.id) {
    AlertPopup.show('Please select a hazard option', AlertPopup.warning);
    return;
  }

  if (currentHash === STEPS.images) {
    displayReviewStepInfo(currentReport);
  }

  if (currentHash === STEPS.review) {
    await submitReport();
    return;
  }

  const nextIndex = currentIndex + 1;
  const nextHash = array[nextIndex];

  url.hash = nextHash;
  window.location.href = url.href;
});

const displayReviewStepInfo = (report) => {
  locationOutput.innerHTML = `${report.location.address}`;
  categoryOutput.innerHTML = report.category.name;
  hazardOptionOutput.innerHTML = report.option.name;
  commentOutput.innerHTML = report.comment || 'No comments';
  imagesOutput.innerHTML = '';

  if (report.images?.length) {
    report.images.forEach((image, index) => {
      imagesOutput.innerHTML += `<img src="${image}" alt="Hazard image ${index + 1}"/>`;
    });
  } else {
    imagesOutput.appendChild(getEmptyImages());
  }
};

const setFormValues = (report) => {
  locationAddressLabel.innerHTML = `${report.location.address ? report.location.address : `(${report.location.lat}, ${currentReport.location.lng})`}`;

  // Category and hazard are being set inside getCategories

  commentInput.value = report.comment;

  report.images.forEach((imageUrl) => {
    displayImages(imageUrl);
  });
};

const submitReport = async () => {
  try {
    showButtonLoading('continueBtn');
    const images = await uploadImageToStorage(currentReport.images);
    //CREATE
    if (!idReport) {
      const response = await fetch(`${API_URL}/hazard-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          hazardOptionId: currentReport.option.id,
          location: {
            lat: currentReport.location.lat,
            lng: currentReport.location.lng,
            address: currentReport.location.address,
          },
          comment: currentReport.comment ?? '',
          images: images,
        }),
      });

      if (response.ok) {
        allowRedirect = true;
        const { data } = await response.json();

        const modal = new Modal();

        const button = document.createElement('button');
        button.setAttribute('id', 'open-modal-btn');
        button.setAttribute('class', 'btn btn-primary');
        button.addEventListener('click', () => window.location.assign(`/pages/home/index.html?id=${data.id}&zoom=${Map.FOCUSED_MAP_ZOOM}&focus=true`));
        button.innerHTML = 'Continue Exploring';

        modal.show({
          title: 'Your report has been submitted!',
          description: 'Thank you for helping others have a safe outdoors experience.',
          icon: {
            name: 'icon-report-submitted',
            color: '#000000',
            size: '3.5rem',
          },
          actions: button,
          enableOverlayClickClose: false,
        });
        stopButtonLoading('continueBtn');
      } else {
        throw new Error('Failed to create report');
      }

      return;
    }

    //UPDATE
    const response = await fetch(`${API_URL}/hazard-report?id=${idReport}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        hazardOptionId: currentReport.option.id,
        location: {
          lat: currentReport.location.lat,
          lng: currentReport.location.lng,
          address: currentReport.location.address,
        },
        comment: currentReport.comment ?? '',
        images: images,
      }),
    });

    if (response.ok) {
      await response.json();
      allowRedirect = true;
      const modal = new Modal();

      const button = document.createElement('button');
      button.setAttribute('id', 'open-modal-btn');
      button.setAttribute('class', 'btn btn-primary');
      button.addEventListener('click', () => window.location.replace('/pages/my-reports/index.html'));
      button.innerHTML = 'Back to My Reports';

      modal.show({
        title: 'Your report has been updated!',
        description: 'Thank you for helping others have a safe camping experience.',
        icon: { name: 'icon-check', color: '#000000', size: '3.5rem' },
        actions: button,
        enableOverlayClickClose: false,
      });
      stopButtonLoading('continueBtn', { reset: true });
    } else {
      throw new Error('Failed to create report');
    }
  } catch (error) {
    console.error({ error });
    stopButtonLoading('continueBtn', { reset: true });

    AlertPopup.show(error.message, AlertPopup.error);
  }
};

const uploadImageToStorage = async (images) => {
  const fileResponses = await Promise.all(
    images.map((image, index) =>
      fetch(image)
        .then((res) => res.blob())
        .then((blob) => {
          const name = `${new Date().getTime().toString()}-${index}`;

          const file = new File([blob], name, {
            type: image.split(';')[0].replace('data:', ''),
          });

          return file;
        })
    )
  );

  const responses = await Promise.all(
    fileResponses.map((file) =>
      fetch(`${API_URL}/hazard-image?fileName=${file.name}.${file?.type?.replace('image/', '')}`, {
        method: 'POST',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      }).then((response) => response.json())
    )
  );

  return responses.map(({ data }) => data.url);
};

/**
 *  Breadcrumb
 */
const generateBreadcrumb = () => {
  const allSteps = Object.keys(STEPS).filter((key) => (skipHazardOption ? STEPS?.[key] !== STEPS.hazard : true));

  const array = allSteps.map((key, index) => ({ index, hash: STEPS[key], label: STEPS_LABEL[key] }));

  const url = new URL(window.location.href);
  const currentHash = url.hash;

  const NavElement = ({ label, href, current, addChevron }) => `
   <li>
      <a title="${label}" href="${href}" class="report-hazard-step text-body-3 ${current ? 'text-neutral-700 semibold' : 'text-neutral-500'}">
      ${addChevron ? '<i class="icon-chevron-right"></i>' : ''}
          ${label}
      </a>
    </li>`;

  const elements = [];

  const currentIndex = Object.values(STEPS)
    .filter((hash) => (skipHazardOption ? hash !== STEPS.hazard : true))
    .indexOf(currentHash);

  for (let i = 0; i < array.length; i++) {
    const step = array[i];
    if (step.index <= currentIndex) {
      elements.push(NavElement({ label: step.label, href: step.hash, current: step.index === currentIndex, addChevron: step.index > 0 }));
    }
  }

  document.getElementById('navMenu').innerHTML = elements.join('');
};

reportHazardForm.addEventListener('scroll', function (event) {
  const body = document.querySelector('#report-hazard-body');

  const contentScrollHeight = reportHazardForm.scrollHeight - body.offsetHeight;
  const currentScroll = this.scrollTop / contentScrollHeight;

  if (currentScroll > 0.3 || currentScroll < 0) {
    fullNavMenu.style.boxShadow = '0px 1px 2px 0px rgba(0, 0, 0, 0.15)';
  } else {
    fullNavMenu.style.boxShadow = 'none';
  }

  if (currentScroll === -0) {
    continueBtnContainer.style.boxShadow = '0px 1px 2px 0px rgba(0, 0, 0, 0.15) inset';
  } else {
    continueBtnContainer.style.boxShadow = 'none';
  }
});
