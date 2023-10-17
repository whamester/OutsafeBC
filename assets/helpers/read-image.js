const readImage = (image, successCallback, errorCallback) => {
	if (!image) {
		console.error('Invalid image')
		return
	}
	try {
		const fileReader = new FileReader()
		fileReader.readAsDataURL(image)
		fileReader.addEventListener('load', successCallback)
		fileReader.addEventListener('error', errorCallback)
	} catch (error) {
		console.error(error)
	}
}

export default readImage
