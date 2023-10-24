//Components
import GeoMap from '../../assets/components/GeoMap.js'
import Navbar from '../../assets/components/Navbar.js'
import SearchBar, 
{ SearchBarSuggestionCard } from '../../assets/components/SearchBar.js';
//Helpers
import injectHTML from '../../assets/helpers/inject-html.js'
import apiRequest from "../../assets/helpers/api-request.js";
import modalToggle from '../../assets/helpers/modal-toggle.js';
import debounce from "../../assets/helpers/debounce.js";
import geocode from '../../assets/helpers/geocode.js';
//Models
import Map from "../../assets/models/Map.js";
//Variable Declaration
let geoMap;
let position;
let locationDetails = "";
let searchSuggestions = [];
let mapOptions = {
  zoomControl: false,
  doubleClickZoom: false
};
const markerParams = {
  event: "click",
  func: (idx) => {
    let myElement = document.getElementById(`card-${idx+1}`);
    let topPos = myElement.offsetLeft;
    document.getElementById('cards--box').scrollLeft = topPos;
  }
};

const categories = await apiRequest(`hazard-category`, { method: "GET" });
const reports = await apiRequest(`hazard-report?cursor=0&size=10`, { method: "GET" });

const loadGeolocation = async () => {
  geoMap = new Map(Map.DEFAULT_LOCATION.lat, Map.DEFAULT_LOCATION.lng, mapOptions);
  position = await Map.getCurrentLocation();
  const locationArray = await geocode({lat: position.lat, lng: position.lng}, "reverse-geocode");

  locationDetails = `${ locationArray[0].properties.address_line1 }, ${ locationArray[0]?.properties.address_line2 }`;
  geoMap.setMarkerOnMap(position.lat, position.lng);
  geoMap.map.setView([position.lat, position.lng], Map.CURRENT_ZOOM);
};

const closeSearchSuggestion = (e) => {
  const boxSuggestion = document.getElementById("box--suggestion");
  boxSuggestion.style.display = e?.target?.closest("#box--search") ? "block" : "none";
};

const onSearchInput = debounce(async ({ target }) => {
  const boxSuggestion = document.getElementById("box--suggestion");
  // clear previous search suggestions
  boxSuggestion.innerHTML = "";
  boxSuggestion.style.display = "block";

  if (target?.value?.trim() === "") {
    target.value = ""; return;
  }
  
  searchSuggestions = await geocode({searchTerm: target?.value}, "autocomplete");

  // inject search suggestions
  injectHTML(
    searchSuggestions?.map(item => {
      return { 
        func: SearchBarSuggestionCard, 
        args: item, 
        id: "box--suggestion"
      }
    })
  );

document.querySelectorAll(".card--suggestions")
  .forEach(card => {
    card.addEventListener("click", ({ target }) => {
      searchInput.value =  target.innerText;
      const latLng = JSON.parse(target.dataset?.value);
      geoMap.setMarkerOnMap(latLng.lat, latLng.lng);
      geoMap.map.setView([latLng.lat, latLng.lng]);
      closeSearchSuggestion();
    })
  });
});

const searchBarParams = {
  categories: categories.data,
  reports: reports.data?.results,
};

injectHTML(
  [ 
    {func: Navbar},
    {func: GeoMap},
    {func: SearchBar, args: searchBarParams, id: "header"}
  ]
);

await loadGeolocation();

const searchInput = document.getElementById("input--search")
searchInput.value = locationDetails;
geoMap.createLayerGroups(searchBarParams.reports, markerParams);

document.querySelectorAll(".report--cards").forEach(card => {
  card.addEventListener("click", function () {
    const details = JSON.parse(this.dataset.details);
    geoMap.map.setView([details.location?.lat, details.location?.lng]);
  });
});

document.querySelectorAll("[class^=filter-cb]").forEach(checkbox => {
  checkbox.checked = true
  checkbox.addEventListener("change", function () {
    const filterFor = this.dataset.filterFor;
    if (this.checked)
      geoMap.map?.addLayer(geoMap.mapLayers[filterFor]);
    else 
      geoMap.map?.removeLayer(geoMap.mapLayers[filterFor]);
  });
});

document.getElementById("button--filter-open")
  .addEventListener("click", () => modalToggle("#modal--filter"));

document.getElementById("button--filter-close")
  .addEventListener("click", () => modalToggle("#modal--filter"));

document.getElementById("input--search")
  .addEventListener("input", (e) => onSearchInput(e));

document.getElementById("map")
  .addEventListener("click", closeSearchSuggestion)

geoMap.map?.on("dblclick", async function (e) {
  const lat = e.latlng.lat;
  const lng = e.latlng.lng;
  geoMap.setMarkerOnMap(lat, lng);
  const locationArray = await geocode({lat, lng}, "reverse-geocode");
  locationDetails = `${ locationArray[0].properties.address_line1 }, ${ locationArray[0]?.properties.address_line2 }`;
  searchInput.value = locationDetails;
});
