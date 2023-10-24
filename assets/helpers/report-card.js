import ReportCard from './card-container.js'

class MyReport extends ReportCard {
	constructor(id, category, hazard, location, date, photos, comment) {
		super(id, category, hazard, location, date, photos, comment)
	}

	reportContent() {
		let div = document.createElement('div')
		div.setAttribute('id', `reportCard${this.id}`)
		div.innerHTML = `
        <h2>${this.hazard}</h2>
		<p>${this.location}</p>
		<p>${this.date}</p>
		<p>${this.date}</p>
		<div>${this.photos}</div>
		<p>Description</p>
		<p>${this.comment}</p>
        `
		return div
	}
}

export default MyReport
