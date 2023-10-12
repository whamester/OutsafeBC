class AlertPopup {
	//default messages
	static SOMETHING_WENT_WRONG_MESSAGE = 'Something went wrong'
	//types
	static success = 'success'
	static error = 'error'
	static warning = 'warning'

	constructor() {
		const alert = `
        <style>
			#alert{
				width: 300px;
				background: gray;
				position:absolute;
				top:2rem;
				right:2rem;
				display:flex;
				align-items:center;
				gap:1rem;
				padding:0.5rem;
				border-radius: 1rem;
			}

			#alert #alert-message{
				margin:0;
				padding:0;
				height: 3rem;
				display: flex;
    			align-items: center;
			}

			#alert.dismiss{
				transform: translateY(-200px);
				transition: all ease 0.5s
			}

			#alert.success{
				border: 1px solid var(--warning-success-500-base, #10973d);
				background: var(--warning-success-50, #e7f5ec);
			}

			#alert.warning{
				border: 1px solid var(--warning-warning-500-base, #F3A218);
				background: var(--warning-warning-50, #FEF6E8);
			}

			#alert.error{
				border: 1px solid var(--warning-error-500-base, #d42621);
				background: var(--warning-error-50, #fbe9e9);
			}
        </style>

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
