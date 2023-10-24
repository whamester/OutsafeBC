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
			}
		})
	} catch (error) {
		console.error(error)
	}
}

loadIcons()
