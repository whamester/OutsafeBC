import AlertPopup from '../../assets/components/AlertPopup.js'
import readImage from '../../assets/helpers/read-image.js'

// Variables
const video = document.getElementById('video')
const canvasArea = document.getElementById('canvasArea')

const canvasContext = canvasArea.getContext('2d')
canvasContext.scale(0.5, 0.5)

const imageFilesArray = []
//Open and close the camera on a desktop browser if the device has a camera
document.getElementById('starCameraBtn').addEventListener('click', () => {
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
		document.getElementById('takePictureBtn').disabled = false
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
	document.getElementById('takePictureBtn').disabled = true
}
document.getElementById('stopCameraBtn').addEventListener('click', stopCamera)

document.getElementById('takePictureBtn').addEventListener('click', () => {
	if (imageFilesArray.length < 3) {
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

const saveFile = (files) => {
	if (imageFilesArray.length >= 3) {
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

	imageFilesArray.push(base64File)
	if (imageFilesArray.length === 3) {
		document.getElementById('starCameraBtn').setAttribute('disabled', true)
		document.getElementById('dragAndDropArea').setAttribute('disabled', true)
		document
			.getElementById('uploadPictureDesktopInput')
			.setAttribute('disabled', true)

		stopCamera()
	}
}
