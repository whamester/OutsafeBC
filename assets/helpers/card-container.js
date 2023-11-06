class ReportCard {
  constructor(id, category, hazard, location, date, photos, comment, settings) {
    this.id = id;
    this.category = category;
    this.hazard = hazard;
    this.location = location;
    this.date = date;
    this.photos = photos;
    this.comment = comment;
    this.settings = settings;
  }

  getDateFormatted(){
    const dateObj = new Date(this.date);
    const date = dateObj.toLocaleString('default', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return date
  }

  getTimeFormatted(){
    const dateObj = new Date(this.date);
    const time = dateObj.toLocaleTimeString('default', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
    return time
  }

}

export default ReportCard;
