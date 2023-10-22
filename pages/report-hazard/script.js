//Models
import ReportForm from '../../assets/models/ReportForm.js'
import Map from '../../assets/models/Map.js'

//Variable Declaration
const currentReport = new ReportForm()
let position = Map.DEFAULT_LOCATION
let map = null
const API_URL = 'https://enchanting-llama-6664aa.netlify.app/.netlify/functions'

/**
 * Page Init
 */

window.onload = function () {
	displayCurrentSection()
	window.addEventListener('hashchange', displayCurrentSection)

	// Loads the map even if the user has not accepted the permissions
	map = new Map(position)
	map.setMarkerOnMap(position.latitude, position.longitude, 'You', {
		draggable: true,
	}) //TODO: Consult with design the message of the marker

	//Override the current location if the user accepts the permissions
	loadGeolocation()
}

const displayCurrentSection = () => {
	const allPages = document.querySelectorAll('section.page')

	const pageId = location.hash ? location.hash : '#select-location'
	for (let page of allPages) {
		if (pageId === '#' + page.id) {
			page.style.display = 'block'
		} else {
			page.style.display = 'none'
		}
	}
}

const loadGeolocation = async () => {
	position = await Map.getCurrentLocation()
	map.setMarkerOnMap(position.latitude, position.longitude, 'You', {
		draggable: true,
	})
}

/**
 * Step 1: Location
 */

if (map) {
	map.on('click', onSelectLocation)
}

const onSelectLocation = (event) => {
	map.removeLayer(marker)
	map.setMarkerOnMap(event.latlng.lat, event.latlng.lng, 'Location selected', {
		draggable: true,
	})

	currentReport.location = {
		lat: event.latlng.lat,
		lng: event.latlng.lng,
		address: 'Fake address', //TODO: Get address
	}
}

/**
 * Step 2: Category List
 */

const getCategories = async () => {
	try {
		let response = await fetch(`${API_URL}/hazard-category`)
		let { data } = await response.json()
		const content = document.getElementById('hazard-category-content')

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
		console.error(error)
	}
}

getCategories()

/**
 * Step 3: Hazard Options List
 */
document
	.querySelectorAll('[name="hazardOptionRadioBtn"]')
	.forEach((categoryElement) => {
		categoryElement.addEventListener('change', (event) => {
			window.location.href = '#additional-details'
			currentReport.categoryOptionId = event.target.value
		})
	})

/**
 * Step 4: Comments
 */
commentInput.addEventListener('change', (event) => {
	currentReport.comment = event.target.value
})

/**
 * Step 5: Images
 * Pending
 */

function checkMobileDevice() {
	let navegador = navigator.userAgent;
	// let mensaje;
	let esDispositivoMovil;
	if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
	//   mensaje = "Estás usando un dispositivo móvil!!";
	  esDispositivoMovil = true;
	  document.getElementById("desktop").style.display = "none"
	} else {
	//   mensaje = "No estás usando un móvil";
	  esDispositivoMovil = false;
	  document.getElementById("mobile").style.display = "none"
	}

	// Set the message in the <div>
	// document.getElementById("resultado").textContent = mensaje;

	// Return true or false
	// return esDispositivoMovil;
	
  }

//   // Call the function and get the result
//   let isMobile = checkMobileDevice();

//   // You can use the isMobile variable as true or false
//   if(isMobile === true){
// 	document.getElementById("desktop").style.display = "none"
// 	// console.log("Is a mobile device");  
//   }else{
// 	document.getElementById("mobile").style.display = "none"
// 	// console.log("Is not a mobile device");
//   }

/**
 * Step 6: Show Confirmation
 */
showConfirmationBtn.addEventListener('click', () => {
	locationOutput.innerHTML = `${currentReport.location.address} (${currentReport.location.lat},${currentReport.location.lng})`
	categoryOutput.innerHTML = currentReport.categoryId
	hazardOptionOutput.innerHTML = currentReport.categoryOptionId
	commentOutput.innerHTML = currentReport.comment
})

/**
 * Submit Form
 */
reportHazardForm.addEventListener('submit', function (event) {
	event.preventDefault()
	console.log(currentReport)
	//TODO: Hit create hazard report endpoint
})
