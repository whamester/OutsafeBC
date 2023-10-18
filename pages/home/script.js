//Components
import GeoMap from "../../assets/components/GeoMap.js";
import Navbar from "../../assets/components/Navbar.js";
//Helpers
import injectHTML from "../../assets/helpers/inject-html.js";
//Models
import Map from "../../assets/models/Map.js";
// Api helper
import apiRequest from "../../assets/helpers/api-request.js";

//Variable Declaration
let position;
let mapOptions = {
  zoomControl: false
};

const loadGeolocation = async () => {
  position = await Map.getCurrentLocation();
  new Map(position.lat, position.lng, mapOptions);
  Map.setMarkerOnMap(position.lat, position.lng);
};

/**
 * Page Init
 */
window.onload = async () => {
  const categories = await apiRequest(`hazard-category`, { method: "GET" });
  const reports = await apiRequest(`hazard-report?cursor=0&size=10`, { method: "GET" });

  const params = {
    categories: categories.data,
    reports: reports.data?.results,
    isSearchable: true
  };

  injectHTML(
    [
      [Navbar, params], 
      GeoMap
    ]
  );

  await loadGeolocation();
  Map.createLayerGroups(params.reports);

  document.querySelectorAll(".report--cards").forEach(card => {
    card.addEventListener("click", function () {
      const details = JSON.parse(this.dataset.details);
      console.log(details.location)
      Map.map.setView([details.location?.lat, details.location?.lng], Map.CURRENT_ZOOM)
    })
  });

  document.querySelectorAll("[class^=filter-cb]").forEach(checkbox => {
    checkbox.checked = true
    checkbox.addEventListener("change", function () {
      const filterFor = this.dataset.filterFor;
      if (this.checked)
        Map.map?.addLayer(Map.mapLayers[filterFor]);
      else 
        Map.map?.removeLayer(Map.mapLayers[filterFor]);
    })
  });

  Map.map?.on("click", function (e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    Map.setMarkerOnMap(lat, lng);
  })
}
