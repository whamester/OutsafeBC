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
