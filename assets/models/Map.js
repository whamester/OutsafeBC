class Map {
  static map;
  static currentMarker = null;
  static mapLayers = {};
  static CURRENT_ZOOM = 17;
  static MAP_ID = "map";
  static MAX_ZOOM = 19;
  static DEFAULT_LOCATION = {
    lat: 49.2,
    lng: -123.12,
  };

  constructor(lat, lng, customConfig) {
    Map.map = L.map(Map.MAP_ID, {...customConfig}).setView(
      [lat, lng],
      Map.CURRENT_ZOOM
    );

    L.tileLayer(`https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png`, {
      maxZoom: Map.MAX_ZOOM,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(Map.map);
    
    document.getElementById('map').style.zIndex = 0;
  }

  static createIcon(iconParams={}) {
    const icon = new L.Icon({
      ...iconParams,
      iconUrl: `/assets/img/icons/${ iconParams?.iconName ?? "icon-map-pin.png" }`,
      iconSize: iconParams?.iconSize ?? [40, 40]
    })
    return icon;
  }

  static createLayerGroups(hazards) {
    const layers = {};
    hazards.forEach(hazard => {
      const pinIcon = Map.createIcon();
      const key = hazard?.hazard?.name?.toLowerCase();
      const marker = L.marker(
        [hazard?.location?.lat, hazard?.location?.lng], 
        {icon: pinIcon}
      )
      if(layers[key])
        layers[key].push(marker);
      else
        layers[key] = [marker];
    });

    for(const key in layers)
      layers[key] = L.layerGroup(layers[key]).addTo(Map.map);

    Map.mapLayers = layers;
  }

  static setMarkerOnMap(lat, lng, MarkerParams={}) {
    if (Map.currentMarker)
      Map.map.removeLayer(Map.currentMarker);

    const pinIcon = Map.createIcon(MarkerParams.icon);
    Map.currentMarker = L.marker([lat, lng], {
      ...MarkerParams.marker,
      icon: pinIcon,
    }).addTo(Map.map);
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
        lat: latitude,
        lng: longitude,
      };
    } catch (error) {
      console.log(error.message);
      // default value on error
      return Map.DEFAULT_LOCATION;
    }
  }
}

export default Map;
