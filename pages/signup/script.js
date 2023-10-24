import { API_URL, GOOGLE_ID } from '../../constants.js'
//Helpers
import { getUserSession, setUserSession } from '../../assets/helpers/storage.js'
import injectHTML from '../../assets/helpers/inject-html.js'
//Components
import AlertPopup from '../../assets/components/AlertPopup.js'
import Navbar from '../../assets/components/Navbar.js'
//Variables
const alert = new AlertPopup()
const password = document.getElementById('password-input')
const confirmPassword = document.getElementById('confirm-password-input')
const confirmPasswordForm = document.getElementById('confirmPwForm')
const confirmPasswordError = document.getElementById('confirmPwError')
const showPw = document.getElementById('show-pw')
const showPwConfirm = document.getElementById('show-pw-confrim')

/**
 * Google Auth Setup
 */

window.onload = function () {
	// Inject Navbar
	injectHTML([Navbar], 'home-body', 'afterbegin')

	const user = getUserSession()

	if (!!user?.id) {
		window.location.replace('/')
	}

	google.accounts.id.initialize({
		client_id: GOOGLE_ID,
		callback: async (googleResponse) => {
			try {
				const response = await fetch(`${API_URL}/user?provider=google`, {
					method: 'POST',
					body: JSON.stringify(googleResponse),
				})

				const { data, error } = await response.json()

				if (data?.id) {
					alert.show('Welcome!')

					setUserSession(data)
					window.location.replace('/')
				}

				if (!!error) {
					alert.show(error, AlertPopup.error)
				}
			} catch (error) {
				console.debug({ error })
			}
		},
		use_fedcm_for_prompt: true,
	})
	google.accounts.id.renderButton(document.getElementById('google-button'), {
		theme: 'outline',
		size: 'large',
	})
	google.accounts.id.prompt()
}

/**
 * Create Account Submit
 */
document
	.getElementById('signup-form')
	.addEventListener('submit', async (event) => {
		event.preventDefault()
		const email = document.getElementById('email-input').value
		const password = document.getElementById('password-input').value
		const userName = document.getElementById('name-input').value
		try {
			const response = await fetch(`${API_URL}/user?provider=password`, {
				method: 'POST',
				body: JSON.stringify({
					email,
					password,
					userName,
				}),
			})

			const { data, error } = await response.json()
			if (data?.id) {
				alert.show('Welcome!')

				setUserSession(data)
				window.location.replace('/')
			}

			if (!!error) {
				alert.show(error, AlertPopup.error)
			}
		} catch (error) {
			console.debug(error)
		}
	})

/**
 * Validate Password
 */

function validatePassword() {
	if (password.value != confirmPassword.value) {
		confirmPasswordForm.classList.add('error')
		confirmPasswordError.style.display = 'block'
	} else {
		confirmPasswordForm.classList.remove('error')
		confirmPasswordError.style.display = 'none'
	}
}

password.onchange = validatePassword
confirmPassword.onkeyup = validatePassword

/**
 * Toggle Password Visibility
 */

showPw.addEventListener('click', () => {
	if (password.type === 'password') {
		password.type = 'text'
	} else {
		password.type = 'password'
	}
})

showPwConfirm.addEventListener('click', () => {
	if (confirmPassword.type === 'password') {
		confirmPassword.type = 'text'
	} else {
		confirmPassword.type = 'password'
	}
})
