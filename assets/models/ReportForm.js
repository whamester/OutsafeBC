class ReportForm {
  constructor() {
    this.categoryId = null;
    this.categoryOptionId = null;
    this.location = {
      lat: null,
      lng: null,
      address: null,
    };
    this.comment = null;
    this.images = [];
  }
}

export default ReportForm;
