import loadIcons from '../helpers/load-icons.js'

// injects the HTML string into the DOM
const injectHTML = (params) => {
	params.forEach(comp => {
		const root = document.querySelector(comp?.target ?? "#root");

		if (!root) {
			console.error(`${ comp?.target } element not found.`);
		} else {
			root.insertAdjacentHTML(
				comp?.position ?? "beforeend",
				comp?.func(comp?.args)
			)
		}
	});
}

export default injectHTML
