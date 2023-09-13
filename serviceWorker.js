// lister for install service worker event
self.addEventListener('install',(event)=>{
    console.log("Service worker installed",event)
})

// lister for activate service worker event
self.addEventListener('activate', (event)=>{
    console.log("Service worker activated",event)
})

self.addEventListener('fetch',(event)=>{
    console.log('[FETCH]', event)
})