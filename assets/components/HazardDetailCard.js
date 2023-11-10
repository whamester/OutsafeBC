import ReportCard from '../helpers/card-container.js';
import { API_URL } from '../../constants.js';
import Modal from './Modal.js';
import { getUserSession } from '../helpers/storage.js';
import AlertPopup from './AlertPopup.js';

const user = getUserSession();

class HazardDetailCard extends ReportCard {
  constructor(
    id,
    category,
    hazard,
    location,
    date,
    photos,
    comment,
    icon,
    distance,
    user
  ) {
    super(id, category, hazard, location, date, photos, comment, icon);
    this.distance = distance;
    this.user = user;
    this.divContainer = null;
  }

  showLoginModal() {
    const modal = new Modal();

    const loginBtn = document.createElement('button');
    loginBtn.setAttribute('id', 'open-modal-btn');
    loginBtn.setAttribute('class', 'btn btn-primary');
    loginBtn.addEventListener('click', () =>
      window.location.assign(`/pages/login/index.html`)
    );
    loginBtn.innerHTML = 'Log in';

    modal.show({
      title: 'Please log in to continue',
      description:
        'Thank you for helping others have a safe outdoors experience.',
      icon: {
        name: 'icon-exclamation-mark',
        color: '#000000',
        size: '3.5rem',
      },
      actions: loginBtn,
      enableOverlayClickClose: true,
    });
  }

  async reportStillThere(option) {
    try {
      const alert = new AlertPopup();

      const response = await fetch(
        `${API_URL}/hazard-report-reaction?id=${this.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: this.id,
            still_there: option,
          }),
        }
      );
      const { error, data, message } = await response.json();

      if (!!error) {
        alert.show(
          'Unable to complete the action at the moment',
          AlertPopup.error
        );
        console.error(error);
        return;
      }
      // Success alert
      alert.show('Feedback Submitted!', AlertPopup.success);
      console.log('Success', data, message);
    } catch (error) {
      // Error alert
      alert.show(
        'Unable to complete the action at the moment',
        AlertPopup.error
      );
      console.error(error);
    }
  }

  async flagAsFake() {
    const alert = new AlertPopup();
    try {
      const response = await fetch(
        `${API_URL}/hazard-report-flag?id=${this.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: this.id,
          }),
        }
      );
      const { error, data, message } = await response.json();

      if (!!error) {
        alert.show(
          'Unable to complete the action at the moment',
          AlertPopup.error
        );
        console.error(error);
        return;
      }
      // Success alert
      alert.show('Feedback Submitted!', AlertPopup.success);
      console.log('Success', data, message);
    } catch (error) {
      // Error alert
      alert.show(
        'Unable to complete the action at the moment',
        AlertPopup.error
      );
      console.error(error);
    }
  }

  changeButtonState() {
    if (this.flagged_as_fake) {
      this.divContainer.querySelector('#flagReportBtn').disabled = true;
    } else {
      this.divContainer.querySelector('#flagReportBtn').disabled = false;
    }

    if (this.enable_reaction) {
      this.divContainer.querySelector('#stillThereBtn').disabled = false;
      this.divContainer.querySelector('#notThereBtn').disabled = false;
    } else {
      this.divContainer.querySelector('#stillThereBtn').disabled = true;
      this.divContainer.querySelector('#notThereBtn').disabled = true;
    }
  }

  hazardCardContent() {
    let divContainer = document.createElement('div');
    divContainer.setAttribute('id', `hazard-card__container`);
    let divOuter = document.createElement('div');
    divOuter.setAttribute('id', `hazard-card__outer`);
    divOuter.setAttribute('class', `report-card__outer`);
    let divInner = document.createElement('div');
    divInner.setAttribute('class', `report-card__inner`);
    divInner.innerHTML = `
  <div class="report-card__top-controls">
  <div class="circle-border" id="reportCloseBtn">
  <i class="icon-close-square" style="background-color: var(--neutral-500)"></i>
  </div>
  <div class="circle-border">
  <i class="icon-share" style="background-color: var(--neutral-500)"></i>
  </div>
  </div>
  <div class="report-card__heading">
    <span class="btn__icon report-card__heading__icon" style="background-color: ${
      this.settings.iconBackround
    }">
      <i class="${
        this.settings.icon
      }-outline" style="width:24px; height:24px; background-color: white"></i>
    </span>
        <p class="text-body-1 semibold">${this.hazard}</p>
  </div>

  <div class="report-card__top-info">
    <div class="report-card__details">
      <i class="icon-location-pin-outline" style="background-color: var(--neutral-400)"></i>
      <p class="text-body-2 regular report-card__location-text">${
        this.location
      }</p>
    </div>

    <div class="report-card__date_time">
      <div class="report-card__details">
        <i class="icon-date" style="background-color: var(--neutral-400)"></i>
        <p class="text-body-2 regular">${super.getDateFormatted()}</p>
      </div>

      <div class="report-card__details">
        <i class="icon-time" style="background-color: var(--neutral-400)"></i>
        <p class="text-body-2 regular">${super.getTimeFormatted()}</p>
      </div>
    </div>
    
    <div class="report-card__details">
    <i class="icon-distance" style="background-color: var(--neutral-400)"></i>
    <p class="text-body-2 regular">${this.distance} km away</p>
  </div>
    
  </div>

  <div class="report-card__spacer-line"></div>
      
  <div id="report-card__image-gallery"></div>

  <div class="report-card__spacer-line"></div>

  <p class="text-body-3 regular">Description</p>
  <p class="text-body-2 regular">${this.comment}</p>

  <div class="report-card__spacer-line"></div>
  <p class="text-body-3 regular">Reported by</p>
  <div class="report-card__user-details">
  <img id="user-image" src="${
    this.user.photo || '../../assets/img/default-nav-image.png'
  }" alt="User photo">
  <p class="text-body-2 regular">${this.user.name}</p>
  </div>
  
  <div class="report-card__spacer-line"></div>

  <div class="report-card__hazard-detail-buttons">
    
    <button class="btn btn-success" id="stillThereBtn">
      <i class="icon-check"></i>
      Still there
    </button>
    <button class="btn btn-warning" id="notThereBtn">
      <i class="icon-close"></i>
      Not there
    </button>
    <button class="btn btn-error" id="flagReportBtn">
      <i class="icon-flag"></i>
      Flag report
    </button>
  </div>
      `;

    divInner
      .querySelector('#report-card__image-gallery')
      .appendChild(super.getGallery());
    divOuter.appendChild(divInner);
    divContainer.appendChild(divOuter);
    divContainer
      .querySelector('#stillThereBtn')
      .addEventListener('click', () => {
        if (!user) {
          this.showLoginModal();
        } else {
          this.reportStillThere(true);
        }
      });
    divContainer.querySelector('#notThereBtn').addEventListener('click', () => {
      if (!user) {
        this.showLoginModal();
      } else {
        this.reportStillThere(false);
      }
    });
    divContainer
      .querySelector('#flagReportBtn')
      .addEventListener('click', () => {
        if (!user) {
          this.showLoginModal();
        } else {
          this.flagAsFake();
        }
      });

    this.divContainer = divContainer;

    this.changeButtonState();
    return divContainer;
  }
}

export default HazardDetailCard;
