import { JAWG_ACCESS_TOKEN } from '../../constants.js';
class Map {
  map = null;
  mapLayers = new L.LayerGroup();
  currentMarker = null;
  locationWatcher = null;
  static CURRENT_ZOOM = 12;
  static MAP_ID = 'map';
  static MAX_ZOOM = 22;
  static DEFAULT_MAP_ZOOM = 12; // If we don't set the zoom level, 12 is the default of Leaflet
  static DEFAULT_LOCATION = {
    lat: 55.72,
    lng: -127.64,
  };

  constructor(lat, lng, customConfig = {}) {
    this.map = L.map(Map.MAP_ID, { ...customConfig }).setView(
      [lat, lng],
      customConfig.CURRENT_ZOOM ?? Map.CURRENT_ZOOM
    );

    L.tileLayer(
      `https://{s}.tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token=${JAWG_ACCESS_TOKEN}`,
      {
        attribution:
          '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 0,
        maxZoom: Map.MAX_ZOOM,
        accessToken: JAWG_ACCESS_TOKEN,
      }
    ).addTo(this.map);

    document.getElementById('map').style.zIndex = 0;
  }

  static createIcon(iconParams = {}) {
    const icon = new L.Icon({
      iconUrl: `/assets/icons/${
        iconParams?.iconName ?? 'location-pin-fill-red.svg'
      }`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
      ...iconParams,
    });
    return icon;
  }

  createLayerGroups(hazards, markerParams = {}) {
    hazards?.forEach((hazard, idx) => {
      const categoryId = hazard?.hazardCategory?.id;
      const subCategoryId = hazard?.hazard?.id;
      const iconName = `marker/${hazard?.hazardCategory?.settings?.icon}.svg`
      const pinIcon = Map.createIcon({iconName});
      
      const marker = L.marker([hazard?.location?.lat, hazard?.location?.lng], {
        icon: pinIcon,
      });

      marker.id = hazard.id
      marker.category_id = categoryId;
      marker.sub_category_id = subCategoryId;

      if (markerParams.event)
        marker.on(markerParams.event, () => markerParams.func(hazard?.id, hazard?.location?.lat, hazard?.location?.lng));

      this.mapLayers.addLayer(marker);
    });

    this.mapLayers.addTo(this.map);
  }

  checkMarkerOnMap(hazard) {
    let markerExists = false;
    this.mapLayers.eachLayer(maker => {
      if (maker.id === hazard.id) markerExists = true;
    });
    return markerExists;
  }

  setMarkerOnMap(lat, lng, markerParams = {}) {
    if (this.currentMarker) this.map.removeLayer(this.currentMarker);

    const pinIcon = Map.createIcon(markerParams.icon);
    this.currentMarker = L.marker([lat, lng], {
      ...markerParams.marker,
      icon: pinIcon,
    }).addTo(this.map);
  }

  filterMarker(categoryIdArr = [], subCategoryIdArr = []) {
    this.mapLayers.eachLayer(marker => {
      this.map.removeLayer(marker);
      if (subCategoryIdArr.length === 0 && (categoryIdArr.length === 0 || categoryIdArr.includes(marker.category_id))) {
        this.map.addLayer(marker);
      } else if (categoryIdArr.length === 0 && (subCategoryIdArr.length === 0 || (subCategoryIdArr.includes(marker.sub_category_id)))) {
        this.map.addLayer(marker);
      }
    });
  }

  filterMarkerCount(subCategoryIdArr = []) {
    let count = 0;
    this.mapLayers.eachLayer(marker => {
      if (subCategoryIdArr.includes(marker.sub_category_id)) {
        count++;
      }
    });
    return count;
  }

  static watchGeoLocation(success, error, customOptions = {}) {
    // check if browser supports geolocation
    if (!('geolocation' in navigator)) {
      console.error('Geolocation not supported on your browser.');
      return;
    }

    // navigator options for better accuracy
    const navigatorOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 10000,
      ...customOptions,
    };

    navigator.geolocation.watchPosition(
      async (data) => {
        const { coords } = data;
        this.locationWatcher = coords;
        success(data)
      },
      error,
      navigatorOptions
    );
  }

  static async getCurrentLocation() {
    // check if browser supports geolocation
    if (!('geolocation' in navigator)) {
      console.error('Geolocation not supported on your browser.');
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
      console.error(error.message);
      //TODO: default lat, long values on error
      return Map.DEFAULT_LOCATION;
    }
  }
}

export default Map;
