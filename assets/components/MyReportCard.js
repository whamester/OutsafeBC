import ReportCard from '../helpers/card-container.js';

class MyReportCard extends ReportCard {
  constructor(id, category, hazard, location, date, photos, comment, icon) {
    super(id, category, hazard, location, date, photos, comment, icon);
  }

  reportContent() {
    let divOuter = document.createElement('div');
    divOuter.setAttribute('id', `reportCard${this.id}`);
    divOuter.setAttribute('class', `report-card__outer`);
    let divInner = document.createElement('div');
    divInner.setAttribute('class', `report-card__inner`);

    divInner.appendChild(super.getHeading());
    divInner.appendChild(super.getTopInfo());
    if (this.photos.length > 0) {
      divInner.appendChild(super.getGallery());
    }
    if (this.comment) {
      divInner.appendChild(super.getDescription());
    }
    divInner.appendChild(super.getMyReportButtons());

    // 	<div class="report-card__spacer-line"></div>

    divOuter.appendChild(divInner);
    return divOuter;
  }
}

export default MyReportCard;
