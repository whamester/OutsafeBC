class ReportForm {
	constructor() {
		this.category = {
			id: null,
			name: null,
		}
		this.option = {
			id: null,
			name: null,
		}
		this.location = {
			lat: null,
			lng: null,
			address: null,
		}
		this.comment = null
		this.images = []
		this.images2 = []
	}
}

export default ReportForm
