import { currentReport } from './script.js'

/**
 * Step 2: Category List
 */
// async function getCategory() {
// 	const baseURL =
// 		'https://enchanting-llama-6664aa.netlify.app/.netlify/functions/hazard-category'
// 	let res = await fetch(baseURL)
// 	let data = await res.json()
// 	console.log(data)
// 	for (let i = 0; i < data.data.length; i++) {
// 		catego = data.data[i].name
// 		var catego = document.getElementById('category' + (i + 1))
// 		catego.innerHTML = data.data[i].name
// 	}
// }
// getCategory()
// document
// 	.querySelectorAll('[name="categoryRadioBtn"]')
// 	.forEach((categoryElement) => {
// 		categoryElement.addEventListener('change', (event) => {
// 			window.location.href = '#hazard-type'
// 			currentReport.categoryId = event.target.value
// 		})
// 	})
// async function getCategory() {
const getCategories = async () => {
	return
	try {
		const API_URL =
			'https://enchanting-llama-6664aa.netlify.app/.netlify/functions/hazard-category'
		let response = await fetch(`${API_URL}/hazard-category`)
		let { data } = await response.json()
		console.log(data)
		// const content = document.getElementById('hazard-category-content')
		const content = document.getElementById('hazard-category')
		for (let i = 0; i < data.length; i++) {
			const category = data[i]
			const div = document.createElement('div')
			const radio = document.createElement('input')
			radio.setAttribute('type', 'radio')
			radio.setAttribute('name', 'categoryRadioBtn')
			radio.setAttribute('id', `category-${category.id}-radio`)
			radio.setAttribute('value', category.id)
			radio.addEventListener('change', (event) => {
				window.location.href = '#hazard-type'
				currentReport.categoryId = event.target.value
			})
			const label = document.createElement('label')
			label.setAttribute('id', `category-${category.id}-label`)
			label.setAttribute('for', `category-${category.id}-radio`)
			label.innerHTML = category.name
			div.appendChild(radio)
			div.appendChild(label)
			content.appendChild(div)
		}
	} catch (error) {
		//TODO: display error message
	}
}
