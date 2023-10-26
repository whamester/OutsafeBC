import loadIcons from '../helpers/load-icons.js'

class Modal {
	constructor() {
		const modal = `
            <div id="modal-overlay">
                <div id="modal" class="hidden">
                   <div id="modal-title-container">
                        <h3 id="modal-title"></h3>
                        <p id="modal-description"></p>
                   </div>
                    <div id="modal-actions"> </div>
                </div>
            </div>
		`

		const body = document.getElementsByTagName('body')?.[0]

		let modalContainer = document.getElementById('modal-portal')
		if (!modalContainer) {
			modalContainer = document.createElement('div')
			modalContainer.setAttribute('id', 'modal-portal')
		}
		modalContainer.innerHTML = modal

		body.appendChild(modalContainer)
	}

	show(params) {
		const {
			title,
			description,
			icon = { name: 'icon-check', color: '#000000', size: '3.5rem' },
			actions, // element or string
			enableOverlayClickClose = false,
		} = params

		if (!title) {
			throw new Error('title is required')
		}

		this.title = title
		this.description = description
		this.icon = icon
		this.actions = actions

		let iconElement = null
		if (!!icon) {
			iconElement = document.createElement('i')
			iconElement.setAttribute('class', icon.name)
			iconElement.style.height = icon.size
			iconElement.style.width = icon.size
			iconElement.style.background = icon.color
		}

		const titleElement = document.getElementById('modal-title')
		titleElement.innerHTML = title

		const descriptionElement = document.getElementById('modal-description')
		descriptionElement.innerHTML = description

		const actionsElement = document.getElementById('modal-actions')
		if (typeof actions === 'string') {
			actionsElement.innerHTML = actions
		}

		if (actions instanceof HTMLElement) {
			actionsElement.append(actions)
		}

		if (!!enableOverlayClickClose) {
			const overlay = document.getElementById('modal-overlay')
			overlay.addEventListener('click', () => {
				this.close()
			})
		}

		const modalElement = document.getElementById('modal')
		modalElement.classList.remove('hidden')
		modalElement.addEventListener('click', (event) => {
			event.stopPropagation() // To avoid the modal closing when you click on it
		})

		if (!!iconElement) {
			const titleContainerElement = document.getElementById(
				'modal-title-container'
			)
			modalElement.insertBefore(iconElement, titleContainerElement)
		}

		loadIcons()
	}

	close() {
		const portal = document.getElementById('modal-portal')
		portal.remove() // To close the modal when you click outside the modal
	}
}

export default Modal
