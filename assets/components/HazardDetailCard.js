import ReportCard from '../helpers/card-container.js';

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
    (this.distance = distance), (this.user = user);
  }

  stillThere(){
    
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
      <p class="text-body-2 regular">${this.location}</p>
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
  <img id="user-image" src="${this.user.photo || '../../assets/img/default-nav-image.png'}" alt="User photo">
  <p class="text-body-2 regular">${this.user.name}</p>
  </div>
  
  <div class="report-card__spacer-line"></div>

  <div class="report-card__hazard-detail-buttons">
    
    <button class="btn btn-success">
      <i class="icon-check"></i>
      Still there
    </button>
    <button class="btn btn-warning">
      <i class="icon-close"></i>
      Not there
    </button>
    <button class="btn btn-error">
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
    return divContainer;
  }
}

export default HazardDetailCard;
