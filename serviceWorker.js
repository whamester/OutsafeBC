// importScripts('https://js.pusher.com/beams/service-worker.js')

// lister for install service worker event
self.addEventListener('install', (event) => {
	// console.log("Service worker installed",event)
})

// lister for activate service worker event
self.addEventListener('activate', async (event) => {
	// console.log("Service worker activated",event)
	try {
		// const options = {}
		// const subscription = await self.registration.pushManager.subscribe(options)
		// console.log(JSON.stringify(subscription))
	} catch (err) {
		console.log('Error', err)
	}
})

self.addEventListener('fetch', (event) => {
	// console.log('[FETCH]', event)
})

// self.addEventListener('push', function (event) {
// 	if (event.data) {
// 		console.log('Push event!! ', event.data.json())
// 		const { notification } = event.data.json()
// 		// console.log(notification)
// 		self.registration.showNotification(notification.title, {
// 			body: notification.body,
// 			deep_link: 'https://www.pusher.com',
// 			icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flat_tick_icon.svg/1024px-Flat_tick_icon.svg.png',
// 		})
// 	} else {
// 		console.log('Push event but no data')
// 	}
// })
