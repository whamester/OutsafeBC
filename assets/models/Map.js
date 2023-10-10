class Map {
  static CURRENT_ZOOM = 11;
  static MAX_ZOOM = 19;
  static MAP_ID = "map";
  static DEFAULT_LOCATION = {
    latitude: 49.2,
    longitude: -123.12,
  };

  static pinIcon = new L.Icon({
    iconUrl: "/assets/img/icons/icon-map-pin.png",
  });

  constructor({ latitude, longitude }) {
    this.map = L.map(Map.MAP_ID, { zoomControl: false }).setView(
      [latitude, longitude],
      Map.CURRENT_ZOOM
    );

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: Map.MAX_ZOOM,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);

    this.currentMarker = null;
  }

  setMarkerOnMap(latitude, longitude, message, icon) {
    if (!this.map) {
      this.map = L.map(Map.MAP_ID, { zoomControl: false }).setView(
        [latitude, longitude],
        Map.CURRENT_ZOOM
      );
    }
    if (!!this.map && !!this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
    }

    const marker = L.marker([latitude, longitude], {
      icon: icon ?? Map.pinIcon,
    })
      .bindPopup(message)
      .addTo(this.map);

    this.currentMarker = marker;
  }

  static async getCurrentLocation() {
    // check if browser supports geolocation
    if (!("geolocation" in navigator)) {
      console.log("Geolocation not supported on your browser.");
      return;
    }

    // navigator options for better accuracy
    const navigatorOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          navigatorOptions
        );
      });
      // get lat, long values
      const { latitude, longitude } = position.coords;
      return {
        latitude,
        longitude,
      };
    } catch (error) {
      console.log(error.message);
      //TODO: default lat, long values on error
      return Map.DEFAULT_LOCATION;
    }
  }
}

export default Map;
