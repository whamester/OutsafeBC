import DateFormat from '../models/DateFormat.js';

class ReportCard {
  // id, category, hazard, location, date, photos, comment, settings,flagged_count, not_there_count,still_there_count
  constructor(data) {
    this.id = data.id;
    this.category = data.category;
    this.hazard = data.hazard;
    this.location = data.location;
    this.date = new Date(data.date);
    this.photos = data.photos;
    this.comment = data.comment;

    this.user = data.user;

    this.settings = data.settings;

    this.flagged_count = Number(data.flagged_count) || 0;
    this.not_there_count = Number(data.not_there_count) || 0;
    this.still_there_count = Number(data.still_there_count) || 0;
    this.flagged_as_fake = data.flagged_as_fake || false;
    this.enable_reaction = data.enable_reaction || true;
  }

  getDateFormatted() {
    return DateFormat.getDate(this.date);
  }

  getTimeFormatted() {
    return DateFormat.getTime(this.date);
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

export default ReportCard;
