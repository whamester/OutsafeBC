import ReportCard from '../helpers/card-container.js'
import ToggleSwitch from '../components/ToggleSwitch.js'

class MyReport extends ReportCard {
	constructor(id, category, hazard, location, date, photos, comment) {
		super(id, category, hazard, location, date, photos, comment)
	}

	static formatDate(inputDate) {
		const date = new Date(inputDate)

		const monthNames = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		]

		const day = date.getUTCDate()
		const month = monthNames[date.getUTCMonth()]
		const year = date.getUTCFullYear()

		const formattedDate = `${day} ${month} ${year}`

		return formattedDate
	}

	reportContent() {
		let inputDateString = this.date
		let date = MyReport.formatDate(inputDateString)
		let time = inputDateString.substring(11, 16)

		let photos = this.photos
		let gallery = document.createElement('div')
		gallery.setAttribute('id', 'report-card__picture-container')

		for (const pic of photos) {
			let image = document.createElement('img')
			image.src = pic
			gallery.appendChild(image)
		}

		let divOuter = document.createElement('div')
		divOuter.setAttribute('id', `reportCard${this.id}`)
		divOuter.setAttribute('class', `report-card__outer`)
		let divInner = document.createElement('div')
		divInner.setAttribute('class', `report-card__inner`)
		divInner.innerHTML = `
		<div class="report-card__heading">
			<span class="btn__icon">
				<i class="icon-${this.category}-filled" style="width:24px; height:24px; background-color: white"></i>
			</span>
        	<p class="text-body-1 semibold">${this.hazard}</p>
		</div>

		<div class="report-card__top-info">
			<div class="report-card__location">
				<i class="icon-location-pin-outline" style="background-color: var(--neutral-400)"></i>
				<p class="text-body-2 regular">${this.location}</p>
			</div>

			<div class="report-card__date_time">
				<div class="report-card__date">
					<i class="icon-date" style="background-color: var(--neutral-400)"></i>
					<p class="text-body-2 regular">${date}</p>
				</div>

				<div class="report-card__time">
					<i class="icon-time" style="background-color: var(--neutral-400)"></i>
					<p class="text-body-2 regular">${time}</p>
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
			${ ToggleSwitch(this.id) }
			<button class="btn btn-tertiary text-body-3 medium" id="${this.id}">
				<i class="icon-edit"></i>
				Edit Report
			</button>
		</div>
        `
		divInner.querySelector('#report-card__image-gallery').appendChild(gallery)
		divOuter.appendChild(divInner)
		return divOuter
	}
}

export default MyReport
