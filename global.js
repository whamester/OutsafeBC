import errorInputHelper from './assets/helpers/error-input-helper.js'
import loadIcons from './assets/helpers/load-icons.js'

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

loadIcons()

errorInputHelper()
