const errorInputHelper = () => {
	const formField = document.querySelectorAll('.form-field.error')

	formField.forEach((element) => {
		try {
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
			icon.style.mask = `url(../../assets/icons/exclamation-mark.svg)`
			icon.style[
				'-webkit-mask-image'
			] = `url(../../assets/icons/exclamation-mark.svg)`
			icon.style['mask-size'] = 'cover'
			icon.style['-webkit-mask-size'] = 'cover'
			element.appendChild(icon)
		} catch (error) {
			console.error(error)
			const alert = new AlertPopup()
			alert.show('Error loading icons for the input', AlertPopup.error)
		}
	})
}

export default errorInputHelper
