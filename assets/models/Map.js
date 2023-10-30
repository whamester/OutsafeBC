import { JAWG_ACCESS_TOKEN } from '../../constants.js'
class Map {
  map = null;
  mapLayers = {};
  currentMarker = null;
  static CURRENT_ZOOM = 12;
  static MAP_ID = "map";
  static MAX_ZOOM = 22;
  static DEFAULT_LOCATION = {
    lat: 49.2,
    lng: -123.12,
  };

  constructor(lat, lng, customConfig) {
    this.map = L.map(Map.MAP_ID, {...customConfig}).setView(
      [lat, lng],
      Map.CURRENT_ZOOM
    );

    L.tileLayer(`https://{s}.tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token=${JAWG_ACCESS_TOKEN}`,
      {
        attribution:
          '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 0,
        maxZoom: Map.MAX_ZOOM,
        accessToken: JAWG_ACCESS_TOKEN,
      }).addTo(this.map);
    
    document.getElementById('map').style.zIndex = 0;
  }

  static createIcon(iconParams={}) {
    const icon = new L.Icon({
      iconUrl: `/assets/icons/${ iconParams?.iconName ?? "location-pin-fill-red.svg" }`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
		  popupAnchor: [0, -40],
      ...iconParams
    })
    return icon;
  }

  createLayerGroups(hazards, markerParams={}) {
    const layers = {};
    hazards?.forEach((hazard, idx) => {
      const pinIcon = Map.createIcon();
      const key = hazard?.hazard?.name?.toLowerCase();
      const marker = L.marker(
        [hazard?.location?.lat, hazard?.location?.lng], 
        {icon: pinIcon}
      );

      if (markerParams.event) 
        marker.on(markerParams.event, () => markerParams.func(idx));

      if(layers[key]) layers[key].push(marker);
      else layers[key] = [marker];
    });

    for(const key in layers)
      layers[key] = L.layerGroup(layers[key]).addTo(this.map);

    this.mapLayers = layers;
  }

  setMarkerOnMap(lat, lng, markerParams={}) {
    if (this.currentMarker)
      this.map.removeLayer(this.currentMarker);

    const pinIcon = Map.createIcon(markerParams.icon);
    this.currentMarker = L.marker([lat, lng], {
      ...markerParams.marker,
      icon: pinIcon,
    }).addTo(this.map);
  }

	static watchGeoLocation(success, error, customOptions={}) {
		// check if browser supports geolocation
		if (!('geolocation' in navigator)) {
			console.log('Geolocation not supported on your browser.')
			return
		}

    // navigator options for better accuracy
		const navigatorOptions = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 10000,
      ...customOptions
		}

    navigator.geolocation.watchPosition(
      success,
      error,
      navigatorOptions
    );
  }
}

export default Map
