// injects the HTML string into the DOM
const injectHTML = (params) => {
	params.forEach(comp => {
		const root = document.getElementById(comp?.id ?? "root");

		if (!root) {
			console.error(`${ id } element not found.`);
		} else {
			root.insertAdjacentHTML(
				comp?.position ?? "beforeend",
				comp?.func(comp?.args)
			)
		}
	});
}

export default injectHTML
