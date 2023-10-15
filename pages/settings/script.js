import readImage from '../../assets/helpers/read-image.js'
import {
	getUserSession,
	setUserSession,
	clearUserSession,
} from '../../assets/helpers/storage.js'
import { API_URL } from '../../constants.js'

const user = getUserSession()

const dropArea = document.getElementById('dropArea')
const inputFile = document.getElementById('inputImage')
const nameField = document.getElementById('name')
const emailField = document.getElementById('email')

let userID = user?.id
let picture

let changedFields = {
	name: false,
	photo: false,
}

nameField.addEventListener('input', () => {
	changedFields.name = true
})

inputFile.addEventListener('input', () => {
	changedFields.photo = true
})

//Show user information
function showUserInfo() {
	if (!!user) {
		nameField.setAttribute('value', user?.name)
		emailField.setAttribute('value', user?.email)
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
		const name = nameField.value

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
deleteAccountYesBtn.addEventListener('click', deleteAccount)

async function deleteAccount() {
	try {
		const response = await fetch(`${API_URL}/user`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(user.auth),
		})

		const { error, data, message } = await response.json()

		if (!!error) {
			console.error(error)
			return
		}

		console.log('Account deleted successfully', data, message)

		toggleDelModal()
		clearUserSession()
		window.location.replace('/')
	} catch (error) {
		console.log('Could not delete account', error)
	}
}

// Update settings
// Check permission status
function checkPermissions() {
	const permissionStatus = document.getElementById('permissionStatus')

	if ('Notification' in window) {
		navigator.permissions
			.query({ name: 'notifications' })
			.then((notificationPermissionStatus) => {
				if (notificationPermissionStatus.state !== 'granted') {
					const pElement = document.createElement('p')
					pElement.textContent = 'Push Notification permissions are not granted'
					permissionStatus.appendChild(pElement)
				}
			})
	}

	if ('geolocation' in navigator) {
		navigator.permissions
			.query({ name: 'geolocation' })
			.then((geolocationPermissionStatus) => {
				if (geolocationPermissionStatus.state !== 'granted') {
					const pElement = document.createElement('p')
					pElement.textContent = 'Geolocation permissions are not granted'
					permissionStatus.appendChild(pElement)
				}
			})
	}
}
checkPermissions()

// Check status of push notification setting
async function getNotificationSettings() {
	try {
		const response = await fetch(`${API_URL}/notification?user_id=${userID}`)
		const result = await response.json()
		let status = result.data.is_enabled

		if (status) {
			pushNotificationSwitch.checked = true
		} else {
			pushNotificationSwitch.checked = false
		}
	} catch (error) {
		console.log('Unable to get notification status', error)
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
