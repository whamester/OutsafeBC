class Map {
  static CURRENT_ZOOM = 11;
  static MAX_ZOOM = 19;

  static map;
  static pinIcon = new L.Icon({
    iconUrl: "/assets/img/icons/icon-map-pin.png",
  });

  constructor({latitude, longitude}) {
    Map.map = L.map('map', {zoomControl: false})
    .setView([latitude, longitude], Map.CURRENT_ZOOM);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: Map.MAX_ZOOM,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(Map.map);
  }

  static setMarkerOnMap(latitude, longitude, message, icon) {
    const marker = L.marker([latitude, longitude], { icon: icon ?? Map.pinIcon })
    .bindPopup(message)
    .addTo(Map.map);

    return marker
  }

  static async getCurrentLocation() {
    // check if browser supports geolocation
    if (!("geolocation" in navigator)) {
      console.log("Geolocation not supported on your browser !!!");
      return;
    }

    // navigator options for better accuracy
    const navigatorOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, navigatorOptions);
      })
      // get lat, long values
      const {latitude, longitude} = position.coords
      return {
        latitude,
        longitude
      }
    } catch (error) {
      console.log(error.message);
      // default lat, long values on error
      return {
        latitude: 49.20, 
        longitude: -123.12
      }
    }
  }
}

export default Map;
