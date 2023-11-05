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
}

export default ReportCard;
