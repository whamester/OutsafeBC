//Component
import Header from '../../assets/components/Header.js';
import GeoMap from '../../assets/components/GeoMap.js';
import SearchBar, {
  SearchBarSuggestionCard,
} from '../../assets/components/SearchBar.js';
import HazardCard from '../../assets/components/HazardCard.js';
import ModalFilter from '../../assets/components/ModalFilter.js';
//Helpers
import injectHTML from '../../assets/helpers/inject-html.js';
import injectHeader from '../../assets/helpers/inject-header.js';
import apiRequest from '../../assets/helpers/api-request.js';
import debounce from '../../assets/helpers/debounce.js';
import geocode from '../../assets/helpers/geocode.js';
import loadIcons from '../../assets/helpers/load-icons.js';
//Models
import Map from '../../assets/models/Map.js';
//Variable Declaration
let geoMap;
let position = Map.DEFAULT_LOCATION;
let positionObj = {};
let locationDetails = '';
let hazardCardParams = {};
let searchSuggestions = [];
let reports = [];
let mapOptions = {
  zoomControl: false,
  doubleClickZoom: false,
  CURRENT_ZOOM: 4
};
let flyToTrigger = true;
const FLY_TO_ZOOM = 12;
const ANIMATION_DURATION = 4;

const categories = await apiRequest(`hazard-category`, { method: 'GET' });

const markerParams = {
  event: 'click',
  func: async (idx) => {
    await getReports(position.lat, position.lng);
    const cardWrapper = document.querySelector(".sb-cards-wrapper");
    const card = document.getElementById(`sb-card-${idx + 1}`);
    
    card.scrollIntoView({
      block: 'end',
      behavior: 'smooth'
    });
  },
};

const closeSearchSuggestion = (e) => {
  const boxSuggestion = document.querySelector(".sb-suggestion-wrapper");
  boxSuggestion.style.display = e?.target?.closest(".sb-search-box") ? "block" : "none";
};

const getReportApiCall = async (lat, lng, cursor=0) => {
  const url = `hazard-report?cursor=${cursor}&size=10&lat=${lat}&lan=${lng}`;
  reports = await apiRequest(url, { method: 'GET' });
  hazardCardParams['reports'] = reports.data?.results;
  geoMap.createLayerGroups(hazardCardParams.reports, markerParams);
};

const getLocationApiCall = async (lat, lng) => {
  const locationArray = await geocode({ lat, lng }, 'reverse-geocode');
  locationDetails = `${locationArray[0]?.properties?.address_line1}, ${locationArray[0]?.properties?.address_line2}`;

  positionObj = {
    properties: {
      lat: lat,
      lon: lng,
      address_line1: locationDetails,
      address_line2: 'Current Location',
    },
  };
};

const cardsOnClick = () => {
  document.querySelectorAll('.sb-cards--item').forEach((card) => {
    card.addEventListener('click', function () {
      const details = JSON.parse(this.dataset.details);
      geoMap.map.flyTo([details.location?.lat, details.location?.lng], 
        FLY_TO_ZOOM, 
        {
          animate: true,
          duration: ANIMATION_DURATION,
        });
    });
  });
};

const suggestionOnClick = () => {
  document.querySelectorAll('.sb-suggestion-item').forEach((card) => {
    card.addEventListener('click', async ({ target }) => {
      const suggestionItem = target.closest(".sb-suggestion-item");

      searchInput.value = suggestionItem?.dataset?.addr1
      const latLng = JSON.parse(suggestionItem?.dataset?.latlng);

      geoMap.map.flyTo([latLng.lat, latLng.lng], 
        FLY_TO_ZOOM, 
        {
          animate: true,
          duration: ANIMATION_DURATION,
        });

      closeSearchSuggestion();
      await getReports(latLng.lat, latLng.lng);
    });
  });
};

const getReports = async (lat, lng, cursor = 0) => {
  document.querySelector('.btn-report-hazard').style.display = 'none';
  await getReportApiCall(lat, lng, cursor);
  document.querySelector('.sb-cards')?.remove();
  Object.keys(geoMap.mapLayers)?.forEach((key) => {
    geoMap.map?.removeLayer(geoMap.mapLayers[key]);
  });
  injectHTML([
    { func: HazardCard, args: hazardCardParams, target: '#hazard-comp' },
  ]);
  loadIcons();
  cardsOnClick();
};

const watchGeoLocationSuccess = async ({ coords }) => {
  const lat = coords?.latitude;
  const lng = coords?.longitude;
  geoMap.setMarkerOnMap(lat, lng);
  await getLocationApiCall(lat, lng);
  await getReportApiCall(position.lat, position.lng);
  if (flyToTrigger) {
    geoMap.map.flyTo([lat, lng], FLY_TO_ZOOM, {
      animate: true,
      duration: ANIMATION_DURATION,
    });
    flyToTrigger = false;
  }
};

const watchGeoLocationError = async (err) => {
  console.error(`ERROR(${err.code}): ${err.message}`);
  await getLocationApiCall(position.lat, position.lng);
};

const loadGeolocation = async () => {
  geoMap = new Map(
    Map.DEFAULT_LOCATION.lat,
    Map.DEFAULT_LOCATION.lng,
    mapOptions
  );
  Map.watchGeoLocation(watchGeoLocationSuccess, watchGeoLocationError);
};

const onSearchInput = debounce(async ({ target }) => {
  const boxSuggestion = document.querySelector(".sb-suggestion-wrapper");

  // clear previous search suggestions
  boxSuggestion.innerHTML = "";

  const searchTerm = target?.value;

  if (searchTerm)
    searchSuggestions = await geocode({ searchTerm }, 'autocomplete');
  else searchSuggestions = [];

  // inject search suggestions
  injectHTML(
    searchSuggestions?.map(item => {
      return { 
        func: SearchBarSuggestionCard, 
        args: item, 
        target: ".sb-suggestion-wrapper"
      }
    }) ?? []
  );

  suggestionOnClick();

  boxSuggestion.style.display = "block";
});

const searchBarParams = {
  categories: categories.data,
};

injectHeader([{ func: Header, target: '#home-body', position: 'afterbegin' }]);

injectHTML([
  { func: GeoMap },
  { func: SearchBar, args: searchBarParams },
  { func: ModalFilter, args: searchBarParams.categories },
]);

await loadGeolocation();

const searchInput = document.querySelector('.sb-search-box--input');

const toggleFilterModal = () => {
  const filterModalStyle = document.querySelector('.modal-filter').style;
  filterModalStyle.display =
    filterModalStyle.display === 'block' ? 'none' : 'block';
};

document
  .querySelector('.sb-search-box--filter-btn')
  .addEventListener('click', toggleFilterModal);

document
  .querySelector('.modal-filter--close')
  .addEventListener('click', toggleFilterModal);

document
  .querySelector('.sb-search-box--input')
  .addEventListener('input', (e) => onSearchInput(e));

document
  .querySelector('.sb-search-box--input')
  .addEventListener('focus', (e) => {
    onSearchInput(e);
    e.target.select();
  });

document.getElementById('map').addEventListener('click', closeSearchSuggestion);

loadIcons();
