import Header from '../components/Header.js'
import injectHTML from './inject-html.js'

// injects the HTML string into the DOM
const injectHeader = (id = 'root', position = 'beforeend') => {
	const root = document.getElementById(id)

	if (!root) {
		console.error(`${id} element not found.`)
		return
	}

	injectHTML([Header], id, position)

	document.getElementById('avatar').addEventListener('click', () => {
		const menu = document.querySelector('#header-menu')

		if (menu.classList.contains('hidden')) {
			menu.classList.remove('hidden')
			return
		}

		menu.classList.add('hidden')
	})
}

export default injectHeader
