class AlertPopup {
	//default messages
	static SOMETHING_WENT_WRONG_MESSAGE = 'Something went wrong'
	//types
	static success = 'success'
	static error = 'error'
	static warning = 'warning'

	constructor() {
		const alert = `
        <div id="alert" class="d-none">
            <p id="alert-message"></p>
        </div>

    `

		const body = document.getElementsByTagName('body')?.[0]

		let alertContainer = document.getElementById('alert-portal')
		if (!alertContainer) {
			alertContainer = document.createElement('div')
			alertContainer.setAttribute('id', 'alert-portal')
		}
		alertContainer.innerHTML = alert

		body.appendChild(alertContainer)
	}

	show(message, type = AlertPopup.success, delay = 1500) {
		if (!message) {
			throw new Error('message is required')
		}
		this.message = message
		this.type = type
		this.delay = delay

		const messageElement = document.getElementById('alert-message')
		messageElement.innerHTML = message

		const alertElement = document.getElementById('alert')
		alertElement.classList.add(this.type)
		alertElement.classList.remove('d-none')

		setTimeout(() => {
			const alertElement = document.getElementById('alert')
			alertElement.classList.add('dismiss')
		}, delay)
	}
}

export default AlertPopup
