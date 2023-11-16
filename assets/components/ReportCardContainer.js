import DateFormat from '../models/DateFormat.js';

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

  getGallery() {
    let photos = this.photos;
    let gallery = document.createElement('div');
    gallery.setAttribute('id', 'report-card__picture-container');

    for (const pic of photos) {
      let image = document.createElement('img');
      image.src = pic;
      gallery.appendChild(image);
    }
    return gallery;
  }
}

export default ReportCardContainer;
