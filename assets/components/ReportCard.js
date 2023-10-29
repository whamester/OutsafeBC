import ReportCard from '../helpers/card-container.js'
import loadIcons from '../helpers/load-icons.js'

class MyReport extends ReportCard {
	constructor(id, category, hazard, location, date, photos, comment) {
		super(id, category, hazard, location, date, photos, comment)
	}

	reportContent() {
		let divOuter = document.createElement('div')
		divOuter.setAttribute('id', `reportCard${this.id}`)
		divOuter.setAttribute('class', `report-card__outer`)
		let divInner = document.createElement('div')
		divInner.setAttribute('class', `report-card__inner`)
		divInner.innerHTML = `
		<div class="report-card__heading">
			<span class="btn__icon">
				<i class="icon-${this.category}-filled"></i>
			</span>
        	<p class="text-body-1 semibold">${this.hazard}</p>
		</div>


		<div class="report-card__top-info">
			<div class="report-card__location">
				<i class="icon-location-pin-outline"></i>
				<p class="text-body-2 regular">${this.location}</p>
			</div>

			<div class="report-card__date_time">
				<div class="report-card__date">
					<i class="icon-date"></i>
					<p class="text-body-2 regular">${this.date}</p>
				</div>

				<div class="report-card__time">
					<i class="icon-time"></i>
					<p class="text-body-2 regular">${this.date}</p>
				</div>
			</div>
		</div>

		<div class="report-card__spacer-line"></div>
				
		<div>${this.photos}</div>

		<div class="report-card__spacer-line"></div>

		<p class="text-body-3 regular">Description</p>
		<p class="text-body-2 regular">${this.comment}</p>

		<div class="report-card__spacer-line"></div>

		<div class="report-card__my-reports-buttons">
			<button class="btn btn-secondary">
				<i class="icon-check"></i>
				Update Status
			</button>
			<button class="btn btn-secondary" id="${this.id}">
				<i class="icon-check"></i>
				Edit Report
			</button>
		</div>
        `
		divOuter.appendChild(divInner)
		return divOuter
	}
}

export default MyReport
