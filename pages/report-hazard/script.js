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

//Variable Declaration
const currentReport = new ReportForm();
let position = Map.DEFAULT_LOCATION;

let mapInstance = null;
let skipHazardOption = false;
const user = getUserSession();

const url = new URL(window.location.href);
const idReport = url.searchParams.get('id');

let allowRedirect = false;

const FLY_TO_ZOOM = 12;
const ANIMATION_DURATION = 4;

/**
 * Page Init
 */

//Loading animation (White overlay)
const loader = new LoaderAnimation();

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

    injectHeader([
      { func: Header, target: '#report-hazard-body', position: 'afterbegin' },
    ]);

    displayCurrentSection();
    window.addEventListener('hashchange', displayCurrentSection);

    // Loads the map even if the user has not accepted the permissions
    mapInstance = new Map(position.lat, position.lng);
    mapInstance.setMarkerOnMap(position.lat, position.lng, {
      draggable: true,
    }); //TODO: Consult with design the message of the marker

    if (mapInstance) {
      mapInstance.map.on('click', onSelectLocation);
    }

    await updateCurrentReportLocation(position);
    //Override the current location if the user accepts the permissions
    loadGeolocation();

    populateReport();
  } catch (error) {
    const alert = new AlertPopup();
    alert.show(
      error.message || AlertPopup.SOMETHING_WENT_WRONG_MESSAGE,
      AlertPopup.error,
      500
    );
  }
};

// Event listener for the 'beforeunload' event
window.addEventListener('beforeunload', function (e) {
  const values = [
    currentReport.category.id,
    currentReport.comment,
    currentReport.images.length,
    currentReport.option.id,
  ];

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

  locationAddressLabel.innerHTML = `${
    currentReport.location.address
      ? currentReport.location.address
      : `(${currentReport.location.lat}, ${currentReport.location.lng})`
  }`;
  var enlace = document.getElementById('hazardCategory');
  enlace.setAttribute('onclick', 'location.href="#hazard-category"');
};

const displayCurrentSection = () => {
  try {
    if (skipHazardOption && location.hash === '#hazard-type') {
      window.location.hash = '#additional-details';
    }

    if (skipHazardOption && location.hash === '#review-report') {
      document.getElementById('review-report-category').classList.add('hidden');
    }

    const allPages = document.querySelectorAll('section.page');

    const pageId = location.hash ? location.hash : '#select-location';
    for (let page of allPages) {
      if (pageId === '#' + page.id) {
        page.style.display = 'flex';
      } else {
        page.style.display = 'none';
      }
    }
  } catch (error) {
    const alert = new AlertPopup();
    alert.show(
      error.message || AlertPopup.SOMETHING_WENT_WRONG_MESSAGE,
      AlertPopup.error
    );
  }
};

const loadGeolocation = async () => {
  try {
    position = await Map.getCurrentLocation();
    await updateCurrentReportLocation(position);
    mapInstance.setMarkerOnMap(position.lat, position.lng, {
      draggable: true,
    });
    mapInstance.map.flyTo([position.lat, position.lng], FLY_TO_ZOOM, {
      animate: true,
      duration: ANIMATION_DURATION,
    });
  } catch (error) {
    console.log(error);

    const alert = new AlertPopup();
    alert.show(
      error.message || AlertPopup.SOMETHING_WENT_WRONG_MESSAGE,
      AlertPopup.error
    );
  }
};

const populateReport = async () => {
  if (idReport !== null) {
    document.getElementById('saveReportBtn').style.display = 'none';
    document.getElementById('updateReportBtn').style.display = 'initial';

    const getCollection = async () => {
      try {
        let response = await fetch(`${API_URL}/hazard-report?id=${idReport}`);
        let { data } = await response.json();

        //******* display location ******
        currentReport.location = data.location;

        //******* display category ******

        document
          .querySelectorAll(`input[value="${data.hazardCategory.id}"]`)[0]
          .click();

        currentReport.category.name = data.hazardCategory.name;
        categoryOutput.innerHTML = currentReport.category.name;

        //******* display type ******
        setTimeout(function () {
          document
            .querySelectorAll(`input[value="${data.hazard.id}"]`)[0]
            .click();

          currentReport.option.name = data.hazard.name;
          hazardOptionOutput.innerHTML = currentReport.option.name;
        }, 50);

        //******* display comment ******

        commentInput.value = data.comment;
        currentReport.comment = data.comment;
        commentOutput.innerHTML = currentReport.comment;

        //******* display pictures ******

        data.images.forEach((imageUrl) => {
          displayImages(imageUrl);
        });

        const displayImagesAreaReview = document.getElementById('imagesOutput');
        data.images.forEach((imageUrl) => {
          const imgElement = document.createElement('img');
          imgElement.src = imageUrl;
          displayImagesAreaReview.appendChild(imgElement);
        });
      } catch (error) {
        console.log({ error });
        const alert = new AlertPopup();
        alert.show(
          error.message || AlertPopup.SOMETHING_WENT_WRONG_MESSAGE,
          AlertPopup.error,
          6000
        );
      }
    };

    getCollection();
  } else {
    document.getElementById('updateReportBtn').style.display = 'none';
    document.getElementById('saveReportBtn').style.display = 'flex';
  }
};

const getAddressFromCoordinates = async (params) => {
  try {
    const data = await geocode(params, 'reverse-geocode');

    const properties = data?.[0].properties;
    const address = [properties?.address_line1, properties?.address_line2]
      .filter((value) => !!value)
      .join(' ');

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
  mapInstance.setMarkerOnMap(event.latlng.lat, event.latlng.lng, {
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
    const content = document.getElementById('hazard-category-content');

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
        const selectedCategory = data.find(
          (category) => category.id === selectedCategoryId
        );
        currentReport.category.id = selectedCategoryId;
        currentReport.category.name = category.name;

        const options = selectedCategory.options ?? [];
        const selectedOptionQuestion =
          selectedCategory.ui_settings.report_hazard_question ?? [];

        populateHazardOptions(options, selectedOptionQuestion);

        var enlace = document.getElementById('hazardType');
        enlace.setAttribute('onclick', 'location.href="#hazard-type"');

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
  } catch (error) {
    const alert = new AlertPopup();
    alert.show(
      error.message || AlertPopup.SOMETHING_WENT_WRONG_MESSAGE,
      AlertPopup.error
    );
  }
};

getCategories();

/**
 * Step 3: Hazard Options List
 */

const populateHazardOptions = (options, selectedOptionQuestion) => {
  try {
    const hazardOptionContent = document.getElementById(
      'hazard-option-content'
    );
    hazardOptionContent.innerHTML = '';

    if (options.length === 1) {
      currentReport.option.id = options[0].id;
      currentReport.option.name = options[0].name;
      skipHazardOption = true;
    }

    document.getElementById('hazardTypeQuestion').innerHTML =
      selectedOptionQuestion;

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

        var enlace = document.getElementById('selectHazardOptionLink');
        enlace.setAttribute('onclick', 'location.href="#additional-details"');

        const allIconTypes = document.querySelectorAll('.category-icon-type');
        allIconTypes.forEach((iconType) => {
          iconType.style.display = 'none';
        });

        const selectedLabel = document.querySelector(`label[for=${radio.id}]`);
        const iconType = selectedLabel.querySelector('.category-icon-type');
        if (iconType) {
          iconType.style.display = 'block';
        }
      });

      const label = document.createElement('label');
      label.setAttribute('id', `option-${option.id}-label`);
      label.setAttribute('for', `option-${option.id}-radio`);

      const divContainer = document.createElement('div');
      divContainer.classList.add('container-type');

      const div1Icon = document.createElement('div');
      div1Icon.innerHTML =
        '<img class="category-icon-type" src="../../assets/icons/checkmark.svg" style="display: none">';
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
    }
  } catch (error) {
    const alert = new AlertPopup();
    alert.show(
      error.message || AlertPopup.SOMETHING_WENT_WRONG_MESSAGE,
      AlertPopup.error
    );
  }
};

/**
 * Step 4: Comments
 */
commentInput.addEventListener('change', (event) => {
  currentReport.comment = event.target.value;
});

var enlace = document.getElementById('uploadPicture');
enlace.setAttribute('onclick', 'location.href="#upload-photos"');

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
    document.getElementById('upload-photos-desktop-content').style.display =
      'none';
  } else {
    document.getElementById('upload-photos-mobile-content').style.display =
      'none';
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
  document.getElementById('displayCameraArea').style.display = 'block';
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
      const alert = new AlertPopup();
      alert.show('Error taking the picture', AlertPopup.warning);
    });
    document.getElementById('takeDesktopPictureBtn').disabled = false;
  } else {
    const alert = new AlertPopup();
    alert.show(
      "This browser doesn't support media devices",
      AlertPopup.warning
    );
  }
});

const stopCamera = () => {
  document.getElementById('displayCameraArea').style.display = 'none';
  const tracks = video.srcObject.getTracks();
  tracks.forEach((track) => track.stop());
  document.getElementById('starCameraBtn').disabled = false;
  document.getElementById('stopCameraBtn').disabled = true;
  document.getElementById('takeDesktopPictureBtn').disabled = true;
};
document.getElementById('stopCameraBtn').addEventListener('click', stopCamera);

document
  .getElementById('takeDesktopPictureBtn')
  .addEventListener('click', () => {
    if (currentReport.images.length < 3) {
      canvasContext.drawImage(video, 0, 0);
      const canvasDataURL = canvasArea.toDataURL();

      displayImages(canvasDataURL);
    } else {
      const alert = new AlertPopup();
      alert.show(
        'You have reached the limit of pictures allowed',
        AlertPopup.warning
      );
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
dragAndDropArea.style.height = '200px';
dragAndDropArea.style.width = '400px';
dragAndDropArea.style.background = 'gray';

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
const takeMobilePictureBtnInput = document.getElementById(
  'takeMobilePictureBtn'
);
const uploadPictureMobileInput = document.getElementById(
  'uploadPictureMobileInput'
);
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
    const alert = new AlertPopup();
    alert.show(
      'You have reached the limit of pictures allowed',
      AlertPopup.warning
    );
    return;
  }
  const selectedFiles = Array.isArray(files) ? files : [files];

  if (selectedFiles.length > 3) {
    const alert = new AlertPopup();
    alert.show('You can only upload 3 images', AlertPopup.warning);
  }
  selectedFiles?.splice(0, 3)?.forEach((file) => {
    try {
      readImage(file, ({ target }) => {
        displayImages(target.result);
      });
    } catch (error) {
      const alert = new AlertPopup();
      alert.show('Error uploading the image', AlertPopup.warning);
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

  img.addEventListener('load', function () {
    console.log('Original Width:', img.naturalWidth);
    console.log('Original Height:', img.naturalHeight);
    if (img.naturalWidth < img.naturalHeight) {
      img.style.width = 'auto';
      img.style.height = '84px';
    } else if (img.naturalWidth > img.naturalHeight) {
      img.style.width = '101px';
      img.style.height = 'auto';
    } else {
      img.style.width = 'auto';
      img.style.height = '84px';
    }
  });

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.classList.add('delete-button');
  deleteButton.addEventListener('click', function () {
    imagesArea.querySelector(`.picture-${divNumber}`).removeChild(img);
    imagesArea.querySelector(`.picture-${divNumber}`).removeChild(deleteButton);

    imagesArea.querySelector(`.hide-picture-${divNumber}`).style.display =
      'block';

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
      document
        .getElementById('uploadPictureDesktopInput')
        .removeAttribute('disabled');
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
    document
      .getElementById('uploadPictureDesktopInput')
      .setAttribute('disabled', true);

    stopCamera();
  }
};

var enlace = document.getElementById('showConfirmationBtn');
enlace.setAttribute('onclick', 'location.href="#review-report"');
//#endregion

/**
 * Step 6: Show Confirmation
 */
showConfirmationBtn.addEventListener('click', () => {
  console.log(currentReport);
  locationOutput.innerHTML = `${currentReport.location.address} (${currentReport.location.lat},${currentReport.location.lng})`;
  categoryOutput.innerHTML = currentReport.category.name;
  hazardOptionOutput.innerHTML = currentReport.option.name;
  commentOutput.innerHTML = currentReport.comment;
  imagesOutput.innerHTML = '';

  currentReport.images.forEach((image) => {
    imagesOutput.innerHTML += `<img src="${image}" width="150" />`;
  });
});

/**
 * Step 7: Submit Form
 */
reportHazardForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  try {
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
        button.addEventListener('click', () =>
          window.location.assign(
            `/pages/home/index.html?id=${data.id}&focus=true&zoom=${Map.DEFAULT_MAP_ZOOM}&lat=${data?.location?.lat}&lng=${data?.location?.lng}`
          )
        );
        button.innerHTML = 'Continue Exploring';

        modal.show({
          title: 'Your report has been submitted!',
          description:
            'Thank you for helping others have a safe outdoors experience.',
          icon: {
            name: 'icon-report-submitted',
            color: '#000000',
            size: '3.5rem',
          },
          actions: button,
          enableOverlayClickClose: false,
        });
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
      button.addEventListener('click', () =>
        window.location.replace('/pages/my-reports/index.html')
      );
      button.innerHTML = 'Back to My Reports';

      modal.show({
        title: 'Your report has been updated!',
        description:
          'Thank you for helping others have a safe camping experience.',
        icon: { name: 'icon-check', color: '#000000', size: '3.5rem' },
        actions: button,
        enableOverlayClickClose: false,
      });
    } else {
      throw new Error('Failed to create report');
    }
  } catch (error) {
    const alert = new AlertPopup();
    alert.show(error.message, AlertPopup.error);
  }
});

const uploadImageToStorage = async (images) => {
  const fileResponses = await Promise.all(
    images.map((image) =>
      fetch(image)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], new Date().getTime().toString(), {
            type: image.split(';')[0].replace('data:', ''),
          });

          return file;
        })
    )
  );

  const responses = await Promise.all(
    fileResponses.map((file) =>
      fetch(
        `${API_URL}/hazard-image?fileName=${file.name}.${file?.type?.replace(
          'image/',
          ''
        )}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        }
      ).then((response) => response.json())
    )
  );

  return responses.map(({ data }) => data.url);
};

/**
 *  Display nav (Breadcrumb)
 */

//show buttons when continue
const hazardCategoryElement = document.getElementById('hazardCategory');

hazardCategoryElement.addEventListener('click', () => {
  document.getElementById('hazardCategoryNav').style.display = 'block';
});

const hazardTypeeElement = document.getElementById('hazardType');

hazardTypeeElement.addEventListener('click', () => {
  if (currentReport.category.id != null) {
    document.getElementById('hazardTypeNav').style.display = 'block';
  }
});

const hazardOptionElement = document.getElementById('selectHazardOptionLink');

hazardOptionElement.addEventListener('click', () => {
  if (currentReport.option.id != null) {
    document.getElementById('hazardDetailNav').style.display = 'block';
  }
});

const hazardCommentElement = document.getElementById('uploadPicture');

hazardCommentElement.addEventListener('click', () => {
  document.getElementById('hazardUploadPhotosNav').style.display = 'block';
});

const hazardPhotoElement = document.getElementById('showConfirmationBtn');

hazardPhotoElement.addEventListener('click', () => {
  document.getElementById('hazardReviewReportNav').style.display = 'block';
});

//edit buttons
const editLocationElement = document.getElementById('editLocation');

editLocationElement.addEventListener('click', () => {
  document.getElementById('hazardCategoryNav').style.display = 'none';
  document.getElementById('hazardTypeNav').style.display = 'none';
  document.getElementById('hazardDetailNav').style.display = 'none';
  document.getElementById('hazardUploadPhotosNav').style.display = 'none';
  document.getElementById('hazardReviewReportNav').style.display = 'none';
});

const editCategoryElement = document.getElementById('editCategory');

editCategoryElement.addEventListener('click', () => {
  document.getElementById('hazardTypeNav').style.display = 'none';
  document.getElementById('hazardDetailNav').style.display = 'none';
  document.getElementById('hazardUploadPhotosNav').style.display = 'none';
  document.getElementById('hazardReviewReportNav').style.display = 'none';
});

const editTypeElement = document.getElementById('editType');

editTypeElement.addEventListener('click', () => {
  document.getElementById('hazardDetailNav').style.display = 'none';
  document.getElementById('hazardUploadPhotosNav').style.display = 'none';
  document.getElementById('hazardReviewReportNav').style.display = 'none';
});

const editDetailsElement = document.getElementById('editDetails');

editDetailsElement.addEventListener('click', () => {
  document.getElementById('hazardUploadPhotosNav').style.display = 'none';
  document.getElementById('hazardReviewReportNav').style.display = 'none';
});

const editPhotosElement = document.getElementById('editPhotos');

editPhotosElement.addEventListener('click', () => {
  document.getElementById('hazardReviewReportNav').style.display = 'none';
});

//hide buttons when click on nav
const hazardUploadPhotosNavElement = document.getElementById('selectLocation');

hazardUploadPhotosNavElement.addEventListener('click', () => {
  document.getElementById('hazardCategoryNav').style.display = 'none';
  document.getElementById('hazardTypeNav').style.display = 'none';
  document.getElementById('hazardDetailNav').style.display = 'none';
  document.getElementById('hazardUploadPhotosNav').style.display = 'none';
  document.getElementById('hazardReviewReportNav').style.display = 'none';
});

const hazardCategoryNavElement = document.getElementById('hazardCategoryNav');

hazardCategoryNavElement.addEventListener('click', () => {
  document.getElementById('hazardTypeNav').style.display = 'none';
  document.getElementById('hazardDetailNav').style.display = 'none';
  document.getElementById('hazardUploadPhotosNav').style.display = 'none';
  document.getElementById('hazardReviewReportNav').style.display = 'none';
});

const hazardTypeNavElement = document.getElementById('hazardTypeNav');

hazardTypeNavElement.addEventListener('click', () => {
  document.getElementById('hazardDetailNav').style.display = 'none';
  document.getElementById('hazardUploadPhotosNav').style.display = 'none';
  document.getElementById('hazardReviewReportNav').style.display = 'none';
});

const hazardDetailNavElement = document.getElementById('hazardDetailNav');

hazardDetailNavElement.addEventListener('click', () => {
  document.getElementById('hazardUploadPhotosNav').style.display = 'none';
  document.getElementById('hazardReviewReportNav').style.display = 'none';
});

const hazardUploadPhotosNavEl = document.getElementById(
  'hazardUploadPhotosNav'
);

hazardUploadPhotosNavEl.addEventListener('click', () => {
  document.getElementById('hazardReviewReportNav').style.display = 'none';
});

/**
 *  Back Button
 */

document.getElementById('backButton').addEventListener('click', () => {
  const url = new URL(window.location.href);
  const array = [
    '#select-location',
    '#hazard-category',
    '#hazard-type',
    '#additional-details',
    '#upload-photos',
    '#review-report',
  ];
  const currentHash = url.hash;
  const currentIndex = array.indexOf(currentHash);

  if (currentReport.category.id != '01d364cd-5ba6-4386-a4fb-a0bef8c28a1d') {
    if (currentIndex > 0) {
      const previousIndex = currentIndex - 1;
      const previousHash = array[previousIndex];

      url.hash = previousHash;
      window.location.href = url.href;
    } else {
      window.location.replace('/pages/home/index.html');
    }
  } else if (currentHash === '#additional-details') {
    const previousIndex = currentIndex - 2;
    const previousHash = array[previousIndex];

    url.hash = previousHash;
    window.location.href = url.href;
  } else {
    const previousIndex = currentIndex - 1;
    const previousHash = array[previousIndex];

    url.hash = previousHash;
    window.location.href = url.href;
  }
});
