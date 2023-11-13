import ReportCard from '../helpers/card-container.js';
import ToggleSwitch from './ToggleSwitch.js';

class MyReportCard extends ReportCard {
  constructor(data) {
    super(data);
  }

  reportContent() {
    let divOuter = document.createElement('div');
    divOuter.setAttribute('id', `reportCard${this.id}`);
    divOuter.setAttribute('class', `report-card__outer`);
    let divInner = document.createElement('div');
    divInner.setAttribute('class', `report-card__inner`);

    const icon = this.settings?.detail;
    divInner.innerHTML = `
		<div class="report-card__heading">
			<span class="btn__icon report-card__heading__icon" style="background-color: ${
        icon.iconBackround
      }">
				<i class="${
          icon.icon
        }" style="width:1.5rem; height:1.5rem; background-color: white"></i>
			</span>
        	<p class="text-body-1 semibold">${this.hazard}</p>
		</div>

		<div class="report-card__top-info">
			<div class="report-card__details">
				<i class="icon-location-pin-outline" style="background-color: var(--neutral-400)"></i>
				<p class="text-body-2 regular report-card__location-text">${this.location}</p>
			</div>

			<div class="report-card__date_time">
				<div class="report-card__details">
					<i class="icon-date" style="background-color: var(--neutral-400)"></i>
					<p class="text-body-2 regular">${super.getDateFormatted()}</p>
				</div>

				<div class="report-card__details">
					<i class="icon-time" style="background-color: var(--neutral-400)"></i>
					<p class="text-body-2 regular">${super.getTimeFormatted()}</p>
				</div>
			</div>
		</div>

		<div class="report-card__spacer-line"></div>
				
		<div id="report-card__image-gallery"></div>

		<div class="report-card__spacer-line"></div>

		<p class="text-body-3 regular">Description</p>
		<p class="text-body-2 regular">${this.comment}</p>

		<div class="report-card__spacer-line"></div>

		<div class="report-card__my-reports-buttons">
			${ToggleSwitch(this.id)}
			<button class="btn btn-tertiary text-body-3 medium" onclick="window.location.href='/pages/report-hazard/index.html?id=${
        this.id
      }#review-report'">
				<i class="icon-edit"></i>
				Edit Report
			</button>
		</div>
        `;
    divInner
      .querySelector('#report-card__image-gallery')
      .appendChild(super.getGallery());
    divOuter.appendChild(divInner);
    return divOuter;
  }
}

export default MyReportCard;
