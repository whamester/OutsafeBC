import DateFormat from '../models/DateFormat.js';
import ToggleSwitch from './ToggleSwitch.js';

class ReportCardContainer {
  constructor(data) {
    this.id = data.id;
    this.category = data.category;
    this.hazard = data.hazard;
    this.location = data.location;
    this.photos = data.photos;
    this.comment = data.comment;

    this.user = data.user;

    this.settings = data.settings;

    this.flagged_count = Number(data.flagged_count) || 0;
    this.not_there_count = Number(data.not_there_count) || 0;
    this.still_there_count = Number(data.still_there_count) || 0;

    this.flagged_as_fake = data.flagged_as_fake || false;
    this.enable_reaction = data.enable_reaction || true;

    this.created_at = data.created_at;
    this.deleted_at = data.deleted_at;
    this.updated_at = data.updated_at;
  }

  getDateFormatted() {
    return DateFormat.getDate(new Date(this.created_at));
  }

  getTimeFormatted() {
    return DateFormat.getTime(new Date(this.created_at));
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
      <p class="text-body-2 regular report-card__location-text">${this.location}</p>
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
    galleryContainer.setAttribute('class', 'report-card__image-gallery');
    let gallery = document.createElement('div');
    gallery.setAttribute('class', 'report-card__picture-container');

    for (const pic of photos) {
      let image = document.createElement('img');
      image.src = pic;
      gallery.appendChild(image);
    }
    galleryContainer.appendChild(gallery);
    return galleryContainer;
  }

  getDescription() {
    const contentHTML = `	
    <p class="text-body-3 regular">Description</p>
		<p class="text-body-2 regular">${this.comment}</p>`;
    const div = document.createElement('div');
    div.setAttribute('class', 'report-card__description');
    div.innerHTML = contentHTML;
    return div;
  }
  getMyReportButtons() {
    const contentHTML = `	
    ${ToggleSwitch(this.id, !this.deleted_at)}
    <button class="btn btn-tertiary text-body-3 medium" onclick="window.location.href='/pages/report-hazard/index.html?id=${this.id}#review-report'">
      <i class="icon-edit"></i>
      Edit Report
    </button>`;
    const div = document.createElement('div');
    div.setAttribute('class', 'report-card__my-reports-buttons');
    div.innerHTML = contentHTML;
    return div;
  }
}

export default ReportCardContainer;
