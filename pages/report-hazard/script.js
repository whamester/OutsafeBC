//Models
import ReportForm from '../../assets/models/ReportForm.js'
import Map from '../../assets/models/Map.js'

//Constants
import { API_URL } from '../../constants.js'

//Components
import Header from '../../assets/components/Header.js'
import AlertPopup from '../../assets/components/AlertPopup.js'
import Modal from '../../assets/components/Modal.js'

//Helpers
import { getUserSession } from '../../assets/helpers/storage.js'
import readImage from '../../assets/helpers/read-image.js'
import injectHTML from '../../assets/helpers/inject-html.js'

//Variable Declaration
const currentReport = new ReportForm()
let position = Map.DEFAULT_LOCATION
let map = null
let skipHazardOption = false
const user = getUserSession()

/**
 * Page Init
 */

window.onload = function () {
	try {
		if (!user) {
			window.location.replace('/')
			return
		}

		injectHTML([ 
			{func: Header, target: "#report-hazard-body", position: "afterbegin"},
		])

		displayCurrentSection()
		window.addEventListener('hashchange', displayCurrentSection)

		// Loads the map even if the user has not accepted the permissions
		map = new Map(position)
		map.setMarkerOnMap(position.latitude, position.longitude, 'You', {
			draggable: true,
		}) //TODO: Consult with design the message of the marker

		//Override the current location if the user accepts the permissions
		loadGeolocation()
	} catch (error) {
		const alert = new AlertPopup()
		alert.show(
			error.message || AlertPopup.SOMETHING_WENT_WRONG_MESSAGE,
			AlertPopup.error
		)
	}
}

const displayCurrentSection = () => {
	try {
		if (skipHazardOption && location.hash === '#hazard-type') {
			window.location.hash = '#additional-details'
		}

		if (skipHazardOption && location.hash === '#review-report') {
			document.getElementById('review-report-category').classList.add('hidden')
		}

		const allPages = document.querySelectorAll('section.page')

		const pageId = location.hash ? location.hash : '#select-location'
		for (let page of allPages) {
			if (pageId === '#' + page.id) {
				page.style.display = 'block'
			} else {
				page.style.display = 'none'
			}
		}
	} catch (error) {
		const alert = new AlertPopup()
		alert.show(
			error.message || AlertPopup.SOMETHING_WENT_WRONG_MESSAGE,
			AlertPopup.error
		)
	}
}

const loadGeolocation = async () => {
	try {
		position = await Map.getCurrentLocation()
		map.setMarkerOnMap(position.latitude, position.longitude, 'You', {
			draggable: true,
		})
	} catch (error) {
		const alert = new AlertPopup()
		alert.show(
			error.message || AlertPopup.SOMETHING_WENT_WRONG_MESSAGE,
			AlertPopup.error
		)
	}
}

/**
 * Step 1: Location
 */

if (map) {
	map.on('click', onSelectLocation)
}

currentReport.location = {
	lat: position.latitude,
	lng: position.longitude,
	address: 'Initial Address', //TODO: Get address
}

locationAddressInput.value = `${currentReport.location.address} (${currentReport.location.lat}, ${currentReport.location.lng})`

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
				skipHazardOption = false

				currentReport.option.id = null
				currentReport.option.name = null

				const selectedCategoryId = event.target.value
				const selectedCategory = data.find(
					(category) => category.id === selectedCategoryId
				)
				currentReport.category.id = selectedCategoryId

				const options = selectedCategory.options ?? []

				populateHazardOptions(options)
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
		const alert = new AlertPopup()
		alert.show(
			error.message || AlertPopup.SOMETHING_WENT_WRONG_MESSAGE,
			AlertPopup.error
		)
	}
}

getCategories()

/**
 * Step 3: Hazard Options List
 */

const populateHazardOptions = (options) => {
	try {
		document.getElementById('hazard-option-content').innerHTML = ''
		if (options.length === 1) {
			currentReport.option.id = options[0].id
			currentReport.option.name = options[0].name
			skipHazardOption = true
		}

		for (let i = 0; i < options.length; i++) {
			const option = options[i]

			const div = document.createElement('div')
			const radio = document.createElement('input')

			radio.setAttribute('type', 'radio')
			radio.setAttribute('name', 'optionRadioBtn')
			radio.setAttribute('id', `option-${option.id}-radio`)
			radio.setAttribute('value', option.id)

			radio.addEventListener('change', (event) => {
				currentReport.option.id = event.target.value
				currentReport.option.name = option.name
			})

			const label = document.createElement('label')
			label.setAttribute('id', `option-${option.id}-label`)
			label.setAttribute('for', `option-${option.id}-radio`)
			label.innerHTML = option.name

			div.appendChild(radio)
			div.appendChild(label)

			document.getElementById('hazard-option-content').appendChild(div)
		}
	} catch (error) {
		const alert = new AlertPopup()
		alert.show(
			error.message || AlertPopup.SOMETHING_WENT_WRONG_MESSAGE,
			AlertPopup.error
		)
	}
}

/**
 * Step 4: Comments
 */
commentInput.addEventListener('change', (event) => {
	currentReport.comment = event.target.value
})

/**
 * Step 5: Images
 */

//Checking if the user is accessing through a mobile browser or a desktop browser
function checkMobileDevice() {
	if (
		navigator.userAgent.match(/Android/i) ||
		navigator.userAgent.match(/webOS/i) ||
		navigator.userAgent.match(/iPhone/i) ||
		navigator.userAgent.match(/iPad/i) ||
		navigator.userAgent.match(/iPod/i) ||
		navigator.userAgent.match(/BlackBerry/i) ||
		navigator.userAgent.match(/Windows Phone/i)
	) {
		document.getElementById('upload-photos-desktop-content').style.display =
			'none'
	} else {
		document.getElementById('upload-photos-mobile-content').style.display =
			'none'
	}
}

checkMobileDevice()

//#region Desktop Images
const video = document.getElementById('video')
const canvasArea = document.getElementById('canvasArea')

const canvasContext = canvasArea.getContext('2d')
canvasContext.scale(0.5, 0.5)

//Open and close the camera on a desktop browser if the device has a camera
document.getElementById('starCameraBtn').addEventListener('click', () => {
	if (currentReport.images.length >= 3) {
		return
	}
	document.getElementById('displayCameraArea').style.display = 'block'
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		const mediaPromise = navigator.mediaDevices.getUserMedia({ video: true })
		mediaPromise.then((stream) => {
			video.srcObject = stream

			document.getElementById('starCameraBtn').disabled = true
			document.getElementById('stopCameraBtn').disabled = false
		})
		mediaPromise.catch((error) => {
			console.error(error)
			canvasContext.font = '20px Tahoma'
			canvasContext.fillText(error, 20, 100)
			const alert = new AlertPopup()
			alert.show('Error taking the picture', AlertPopup.warning)
		})
		document.getElementById('takeDesktopPictureBtn').disabled = false
	} else {
		const alert = new AlertPopup()
		alert.show("This browser doesn't support media devices", AlertPopup.warning)
	}
})

const stopCamera = () => {
	document.getElementById('displayCameraArea').style.display = 'none'
	const tracks = video.srcObject.getTracks()
	tracks.forEach((track) => track.stop())
	document.getElementById('starCameraBtn').disabled = false
	document.getElementById('stopCameraBtn').disabled = true
	document.getElementById('takeDesktopPictureBtn').disabled = true
}
document.getElementById('stopCameraBtn').addEventListener('click', stopCamera)

document
	.getElementById('takeDesktopPictureBtn')
	.addEventListener('click', () => {
		if (currentReport.images.length < 3) {
			canvasContext.drawImage(video, 0, 0)
			const canvasDataURL = canvasArea.toDataURL()

			displayImages(canvasDataURL)
		} else {
			const alert = new AlertPopup()
			alert.show(
				'You have reached the limit of pictures allowed',
				AlertPopup.warning
			)
		}
	})

//Click to upload a picture
const fileInput = document.getElementById('uploadPictureDesktopInput')
fileInput.addEventListener('click', stopCamera)
fileInput.addEventListener('change', function () {
	saveFile(Object.values(this.files))
})

//Drag and drop to upload picture
const dragAndDropArea = document.getElementById('dragAndDropArea')
dragAndDropArea.style.height = '200px'
dragAndDropArea.style.width = '400px'
dragAndDropArea.style.background = 'gray'

dragAndDropArea.addEventListener('dragover', (event) => {
	event.preventDefault()
	dragAndDropArea.classList.add('active')
})

dragAndDropArea.addEventListener('dragleave', () => {
	dragAndDropArea.classList.remove('active')
})

dragAndDropArea.addEventListener('drop', (event) => {
	event.preventDefault()
	dragAndDropArea.classList.remove('active')
	saveFile(Object.values(event.dataTransfer.files))
})

//#endregion

//#region  Mobile Images
const takeMobilePictureBtnInput = document.getElementById(
	'takeMobilePictureBtn'
)
const uploadPictureMobileInput = document.getElementById(
	'uploadPictureMobileInput'
)
takeMobilePictureBtnInput.addEventListener('change', handleFileSelection)
uploadPictureMobileInput.addEventListener('change', handleFileSelection)

function handleFileSelection(event) {
	const selectedFiles = event.target.files
	saveFile([...selectedFiles])
}

//#endregion

//#region Mobile and Desktop Image Functions
const saveFile = (files) => {
	if (currentReport.images.length >= 3) {
		const alert = new AlertPopup()
		alert.show(
			'You have reached the limit of pictures allowed',
			AlertPopup.warning
		)
		return
	}
	const selectedFiles = Array.isArray(files) ? files : [files]

	if (selectedFiles.length > 3) {
		const alert = new AlertPopup()
		alert.show('You can only upload 3 images', AlertPopup.warning)
	}
	selectedFiles?.splice(0, 3)?.forEach((file) => {
		try {
			readImage(file, ({ target }) => {
				displayImages(target.result)
			})
		} catch (error) {
			const alert = new AlertPopup()
			alert.show('Error uploading the image', AlertPopup.warning)
		}
	})
}

const displayImages = (base64File) => {
	const imagesArea = document.getElementById('displayImagesArea')
	const img = document.createElement('img')
	img.setAttribute('src', base64File)
	img.style.width = '200px'
	img.style.height = '200px'
	imagesArea.append(img)

	currentReport.images.push(base64File)
	if (currentReport.images.length === 3) {
		document.getElementById('starCameraBtn').setAttribute('disabled', true)
		document.getElementById('dragAndDropArea').setAttribute('disabled', true)
		document
			.getElementById('uploadPictureDesktopInput')
			.setAttribute('disabled', true)

		stopCamera()
	}
}
//#endregion

/**
 * Step 6: Show Confirmation
 */
showConfirmationBtn.addEventListener('click', () => {
	locationOutput.innerHTML = `${currentReport.location.address} (${currentReport.location.lat},${currentReport.location.lng})`
	categoryOutput.innerHTML = currentReport.category.name
	hazardOptionOutput.innerHTML = currentReport.option.name
	commentOutput.innerHTML = currentReport.comment
	imagesOutput.innerHTML = ''

	currentReport.images.forEach((image) => {
		imagesOutput.innerHTML += `<img src="${image}" width="150" />`
	})
})

/**
 * Submit Form
 */
reportHazardForm.addEventListener('submit', async function (event) {
	event.preventDefault()

	try {
		if (!currentReport.images.length) {
			const alert = new AlertPopup()
			alert.show('Please upload at least one image', AlertPopup.warning)
			window.location.hash = '#upload-photos'
			return
		}

		const images = await uploadImageToStorage(currentReport.images)
		const response = await fetch(`${API_URL}/hazard-report`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId: user.id,
				hazardOptionId: currentReport.option.id,
				location: {
					lat: currentReport.location.lat,
					lng: currentReport.location.lng,
					address: currentReport.location.address,
				},
				comment: currentReport.comment ?? '',
				images: images,
			}),
		})

		if (response.ok) {
			await response.json()

			const modal = new Modal()

			const button = document.createElement('button')
			button.setAttribute('id', 'open-modal-btn')
			button.setAttribute('class', 'btn btn-primary')
			button.addEventListener('click', () =>
				window.location.replace('/pages/home')
			)
			button.innerHTML = 'Continue Exploring'

			modal.show({
				title: 'Your report has been submitted!',
				description:
					'Thank you for helping others have a safe camping experience.',
				icon: { name: 'icon-check', color: '#000000', size: '3.5rem' },
				actions: button,
				enableOverlayClickClose: false,
			})
		} else {
			throw new Error('Failed to create report')
		}
	} catch (error) {
		const alert = new AlertPopup()
		alert.show(error.message, AlertPopup.error)
	}
})

const uploadImageToStorage = async (images) => {
	const fileResponses = await Promise.all(
		images.map((image) =>
			fetch(image)
				.then((res) => res.blob())
				.then((blob) => {
					const file = new File([blob], new Date().getTime().toString(), {
						type: image.split(';')[0].replace('data:', ''),
					})

					return file
				})
		)
	)

	console.log(fileResponses)

	const responses = await Promise.all(
		fileResponses.map((file) =>
			fetch(
				`${API_URL}/hazard-image?fileName=${file.name}.${file?.type?.replace(
					'image/',
					''
				)}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': file.type,
					},
					body: file,
				}
			).then((response) => response.json())
		)
	)

	console.log({ responses })

	return responses.map(({ data }) => data.url)
}
