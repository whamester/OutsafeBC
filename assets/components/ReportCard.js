import ReportCard from '../helpers/card-container.js'

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
        <h2>${this.hazard}</h2>
		<p>${this.location}</p>
		<p>${this.date}</p>
		<p>${this.date}</p>
		<div>${this.photos}</div>
		<p>Description</p>
		<p>${this.comment}</p>
        `
		divOuter.appendChild(divInner)
		return divOuter
	}
}

export default MyReport
