import ReportCard from './card-container.js'

class MyReport extends ReportCard {
	constructor(id, category, hazard, location, date, photos, comment) {
		super(id, category, hazard, location, date, photos, comment)
	}

	reportContent() {
		let div = document.createElement('div')
		div.setAttribute('id', `reportCard${this.id}`)
		div.innerHTML = `
        <h2 class="hazardTitle">${this.hazard}</h2>
		<p class="hazardLocation">${this.location}</p>
		<p class="hazardDate">${this.date}</p>
		<p class="hazardTime">${this.date}</p>
		<div class="hazardPohotos">${this.photos}</div>
		<p class="hazardDescTitle">Description</p>
		<p class="hazardDesc">${this.comment}</p>
        `
		return div
	}
}

export default MyReport
