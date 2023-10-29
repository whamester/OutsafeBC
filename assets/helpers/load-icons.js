import AlertPopup from '../components/AlertPopup.js'

const loadIcons = () => {
	try {
		const icons = document.querySelectorAll('i[class^="icon-"]')

		icons.forEach((element) => {
			const classes = [...element.classList]
			const iconName = classes.find((className) => className.includes('icon-'))

			if (iconName) {
				element.style.mask = `url(/assets/icons/${iconName.replace(
					'icon-',
					''
				)}.svg)`
				element.style[
					'-webkit-mask-image'
				] = `url(/assets/icons/${iconName.replace('icon-', '')}.svg)`
				element.style['mask-size'] = 'cover'
				element.style['-webkit-mask-size'] = 'cover'
			}
		})
	} catch (error) {
		console.error(error)
		const alert = new AlertPopup()
		alert.show('Error loading icons', AlertPopup.error)
	}
}

export default loadIcons
