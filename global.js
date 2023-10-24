if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('/serviceWorker.js')
		.then((reg) => {
			console.log('Service worker registered', reg)
		})
		.catch((err) => {
			console.log('Service worker not registered', err)
		})
}

const loadIcons = () => {
	try {
		const icons = document.querySelectorAll('i[class^="icon-"]')

		icons.forEach((element) => {
			const classes = [...element.classList]
			const iconName = classes.find((className) => className.includes('icon-'))

			if (iconName) {
				element.style.mask = `url(assets/icons/${iconName.replace(
					'icon-',
					''
				)}.svg)`
				element.style[
					'-webkit-mask-image'
				] = `url(assets/icons/${iconName.replace('icon-', '')}.svg)`
				element.style['mask-size'] = 'cover'
				element.style['-webkit-mask-size'] = 'cover'
			}
		})
	} catch (error) {
		console.error(error)
	}
}

loadIcons()

const errorInputHelper = () => {
	const formField = document.querySelectorAll('.form-field.error')

	formField.forEach((element) => {
		const icon = document.createElement('i')
		const input = element.querySelector('input')
		const inputAttributes = [...input.attributes]
		const isDisabled = inputAttributes.find((value) => {
			return value.name === 'disabled'
		})

		if (isDisabled) {
			element.classList.remove('error')

			return
		}

		icon.setAttribute('class', 'icon-exclamation-mark')
		icon.style.mask = `url(assets/icons/exclamation-mark.svg)`
		icon.style['-webkit-mask-image'] = `url(assets/icons/exclamation-mark.svg)`
		icon.style['mask-size'] = 'cover'
		icon.style['-webkit-mask-size'] = 'cover'
		element.appendChild(icon)
	})
}

errorInputHelper()
