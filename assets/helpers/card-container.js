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

  getDateFormatted(){
    const date = this.date.toLocaleString('default', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return date;
  }

  getTimeFormatted(){
    const time = this.date.toLocaleTimeString('default', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
    return time;
  }

  getGallery(){
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
