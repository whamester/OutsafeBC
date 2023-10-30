//Components
import GeoMap from '../../assets/components/GeoMap.js'
import injectHeader from '../../assets/helpers/inject-header.js'
//Helpers
import injectHTML from '../../assets/helpers/inject-html.js'
//Models
import Map from '../../assets/models/Map.js'

//Variable Declaration
let position = Map.DEFAULT_LOCATION
let map = null

/**
 * Page Init
 */
window.onload = function () {
	injectHeader('home-body', 'afterbegin')
	injectHTML([GeoMap])

	// Loads the map even if the user has not accepted the permissions
	map = new Map(position)
	map.setMarkerOnMap(position.latitude, position.longitude, 'You') //TODO: Consult with design the message of the marker

	//Override the current location if the user accepts the permissions
	loadGeolocation()
}

const loadGeolocation = async () => {
	position = await Map.getCurrentLocation()
	map.setMarkerOnMap(position.latitude, position.longitude, 'You')
}
