import DateFormat from '../models/DateFormat.js';

class ReportCard {
  constructor(id, category, hazard, location, date, photos, comment, settings) {
    this.id = id;
    this.category = category;
    this.hazard = hazard;
    this.location = location;
    this.date = new Date(date);
    this.photos = photos;
    this.comment = comment;
    this.settings = settings;
  }

  getDateFormatted() {
    return DateFormat.getDate(this.date);
  }

  getTimeFormatted() {
    return DateFormat.getTime(this.date);
  }

  getHeading() {
    const icon = this.settings?.detail;
    const contentHTML = `
			<span class="btn__icon report-card__heading__icon" style="background-color: ${icon.iconBackround}">
				<i class="${icon.icon}" style="width:1.5rem; height:1.5rem; background-color: white"></i>
			</span>
      <p class="text-body-1 semibold">${this.hazard}</p>
    `;
    const div = document.createElement('div');
    div.setAttribute('class', 'report-card__heading');
    div.innerHTML = contentHTML;
    return div;
  }

  getTopInfo() {
    const contentHTML = `
    <div class="report-card__details">
      <i class="icon-location-pin-outline" style="background-color: var(--neutral-400)"></i>
      <p class="text-body-2 regular report-card__location-text">${
        this.location
      }</p>
    </div>

    <div class="report-card__date_time">
      <div class="report-card__details">
        <i class="icon-date" style="background-color: var(--neutral-400)"></i>
        <p class="text-body-2 regular">${this.getDateFormatted()}</p>
      </div>

      <div class="report-card__details">
        <i class="icon-time" style="background-color: var(--neutral-400)"></i>
        <p class="text-body-2 regular">${this.getTimeFormatted()}</p>
      </div>
    </div>
  `;
    const div = document.createElement('div');
    div.setAttribute('class', 'report-card__top-info');
    div.innerHTML = contentHTML;
    return div;
  }

  getGallery() {
    let photos = this.photos;
    let galleryContainer = document.createElement('div');
    galleryContainer.setAttribute('id', 'report-card__image-gallery');
    let gallery = document.createElement('div');
    gallery.setAttribute('id', 'report-card__picture-container');

    for (const pic of photos) {
      let image = document.createElement('img');
      image.src = pic;
      gallery.appendChild(image);
    }
    galleryContainer.appendChild(gallery);
    return galleryContainer;
  }
}

export default ReportCard;
