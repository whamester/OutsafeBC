import readImage from '../../assets/helpers/read-image.js'
import { getUserSession, setUserSession } from '../../assets/helpers/storage.js'
import { API_URL } from '../../constants.js'

const user = getUserSession()

const dropArea = document.getElementById('dropArea')
const inputFile = document.getElementById('inputImage')

let userID = user?.id
let picture

let changedFields = {
	name: false,
	photo: false,
}

document.getElementById('name').addEventListener('input', () => {
	changedFields.name = true
})

document.getElementById('inputImage').addEventListener('input', () => {
	changedFields.photo = true
})

//Show user information
function showUserInfo() {
	if (!!user) {
		document.getElementById('name').setAttribute('value', user?.name)
		document.getElementById('email').setAttribute('value', user?.email)
		return
	}

	window.location.replace('/')
}

showUserInfo()

function clearDirtyField() {
	changedFields.name = false
	changedFields.photo = false
}

// Change user information
saveProfileInfoBtn.addEventListener('click', async (e) => {
	e.preventDefault()

	if (changedFields.photo) {
		const result = await saveProfilePicture()
		await saveUserInfo(result.data.url)
		clearDirtyField()

		return
	}

	if (changedFields.name) {
		await saveUserInfo()
		clearDirtyField()

		return
	}
})

// Save user information
async function saveUserInfo(photo = undefined) {
	try {
		const name = document.getElementById('name').value

		const response = await fetch(`${API_URL}/user?id=${userID}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
				photo,
			}),
		})
		const { data, error, message } = await response.json()

		if (!!error) {
			console.error(error)
			return
		}

		if (data) {
			setUserSession({
				...user,
				...data,
			})

			console.log(message)
		}
	} catch (error) {
		console.log('user name error', error)
	}
}

// Change password
function togglePwModal() {
	const pwModal = resetPwPopup.style
	pwModal.display = pwModal.display === 'block' ? 'none' : 'block'
}

resetPwBtn.addEventListener('click', togglePwModal)
resetPwSaveBtn.addEventListener('click', togglePwModal)
resetPwCanelBtn.addEventListener('click', togglePwModal)

// Profile photo
function showProfilePic(url = '#') {
	profilePhoto.setAttribute('src', url)
}

showProfilePic(user?.photo)

inputFile.addEventListener('change', loadImage)

function loadImage() {
	picture = inputFile.files[0]

	readImage(picture, ({ target }) => {
		showProfilePic(target.result)
	})
}

dropArea.addEventListener('dragover', (e) => {
	e.preventDefault()
})

dropArea.addEventListener('drop', (e) => {
	e.preventDefault()

	inputFile.files = e.dataTransfer.files
	loadImage()
})

async function saveProfilePicture() {
	try {
		const response = await fetch(
			`${API_URL}/user-image?userId=${userID}.${picture?.type?.replace(
				'image/',
				''
			)}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': picture.type,
				},
				body: picture,
			}
		)
		const result = await response.json()
		return result
	} catch (error) {
		console.log('picture upload error', error)
		return null
	}
}

// Delete profile
function toggleDelModal() {
	const delModal = deleteAccountConfirm.style
	delModal.display = delModal.display === 'block' ? 'none' : 'block'
}

deleteAccountBtn.addEventListener('click', toggleDelModal)

deleteAccountNoBtn.addEventListener('click', toggleDelModal)

// Update settings
// Check permission status
if ('Notification' in window) {
	navigator.permissions
		.query({ name: 'notifications' })
		.then((notificationPermissionStatus) => {
			if (notificationPermissionStatus.state !== 'granted') {
				const permissionStatus = document.getElementById('permissionStatus')
				const pElement = document.createElement('p')
				pElement.textContent = 'Push Notification permissions are not granted'
				permissionStatus.appendChild(pElement)
			}
		})
} else {
	console.log('Push notifications are not supported in this browser.')
}

if ('geolocation' in navigator) {
	navigator.permissions
		.query({ name: 'geolocation' })
		.then((geolocationPermissionStatus) => {
			if (geolocationPermissionStatus.state !== 'granted') {
				const permissionStatus = document.getElementById('permissionStatus')
				const pElement = document.createElement('p')
				pElement.textContent = 'Geolocation permissions are not granted'
				permissionStatus.appendChild(pElement)
			}
		})
} else {
	console.log('Geolocation is not supported in this browser.')
}

// Check status of push notification setting
async function getNotificationSettings() {
	const response = await fetch(`${API_URL}/notification?user_id=${userID}`)
	const result = await response.json()
	let status = result.data.is_enabled

	if (status) {
		pushNotificationSwitch.checked = true
	} else {
		pushNotificationSwitch.checked = false
	}
}

getNotificationSettings()

// Toggle push notification setting
async function setNotificationSettings() {
	try {
		const response = await fetch(`${API_URL}/notification?user_id=${userID}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				is_enabled: !!pushNotificationSwitch.checked,
			}),
		})

		const { error, data, message } = await response.json()

		if (!!error) {
			console.error(error)
			return
		}

		console.log('Notifications turned on', data, message)
	} catch (error) {
		console.log('Notifications turned off', error)
	}
}

pushNotificationSwitch.addEventListener('change', setNotificationSettings)
