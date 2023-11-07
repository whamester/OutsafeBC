import { API_URL } from '../../constants.js';
//Components
import Header from '../../assets/components/Header.js';
import GeoMap from '../../assets/components/GeoMap.js';
import SearchBar, {
  SearchBarSuggestionCard,
} from '../../assets/components/SearchBar.js';
import HazardCard from '../../assets/components/HazardCard.js';
import ModalFilter from '../../assets/components/ModalFilter.js';
import AlertPopup from '../../assets/components/AlertPopup.js';
//Helpers
import injectHTML from '../../assets/helpers/inject-html.js';
import injectHeader from '../../assets/helpers/inject-header.js';
import apiRequest from '../../assets/helpers/api-request.js';
import debounce from '../../assets/helpers/debounce.js';
import geocode from '../../assets/helpers/geocode.js';
import loadIcons from '../../assets/helpers/load-icons.js';
import HazardDetailCard from '../../assets/components/HazardDetailCard.js';
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
  CURRENT_ZOOM: 4,
};
let categoryFilters = [];
let flyToTrigger = true;
const FLY_TO_ZOOM = 12;
const ANIMATION_DURATION = 4;
const alert = new AlertPopup();

const categories = await apiRequest(`hazard-category`, { method: 'GET' });

const markerParams = {
  event: 'click',
  func: async (idx) => {
    await getReports(position.lat, position.lng, categoryFilters);
    const card = document.getElementById(`sb-card-${idx + 1}`);

    card.scrollIntoView({
      block: 'end',
      behavior: 'smooth',
    });
  },
};

const removePreviousMarkers = () => {
  Object.keys(geoMap.mapLayers).forEach((key) => {
    geoMap.map.removeLayer(geoMap.mapLayers[key]);
  });
};

const closeSearchSuggestion = (e) => {
  const boxSuggestion = document.querySelector('.sb-suggestion-wrapper');
  boxSuggestion.style.display = e?.target?.closest('.sb-search-box')
    ? 'block'
    : 'none';

  document.querySelector('.sb-categories-wrapper').style.display = 'flex';
};

const getReportApiCall = async (lat, lng, categoryFilters = [], cursor = 0) => {
  // clear previous reports
  hazardCardParams['reports'] = [];
  const url = `hazard-report?cursor=${cursor}&size=10&lat=${lat}&lan=${lng}&category_ids=${categoryFilters.join(
    ','
  )}`;
  reports = await apiRequest(url, { method: 'GET' });
  hazardCardParams['reports'] = reports.data?.results;
  geoMap.createLayerGroups(hazardCardParams.reports, markerParams);
};

const cardsOnClick = () => {
  document.querySelectorAll('.sb-cards--item').forEach((card) => {
    card.addEventListener('click', function () {
      const details = JSON.parse(this.dataset.details);
      geoMap.map.flyTo(
        [details.location?.lat, details.location?.lng],
        FLY_TO_ZOOM,
        {
          animate: true,
          duration: ANIMATION_DURATION,
        }
      );
    });
  });
};

const suggestionOnClick = () => {
  document.querySelectorAll('.sb-suggestion-item').forEach((card) => {
    card.addEventListener('click', async ({ target }) => {
      const suggestionItem = target.closest('.sb-suggestion-item');

      searchInput.value = suggestionItem?.dataset?.addr1;
      const latLng = JSON.parse(suggestionItem?.dataset?.latlng);

      geoMap.map.flyTo([latLng.lat, latLng.lng], FLY_TO_ZOOM, {
        animate: true,
        duration: ANIMATION_DURATION,
      });

      closeSearchSuggestion();
      await getReports(latLng.lat, latLng.lng);
    });
  });
};

const quickFiltersOnClick = async ({ target }) => {
  document.querySelector('.sb-cards')?.remove();
  const quickFilter = target.closest('.quick-filter');
  const categoryId = quickFilter.dataset.categoryId;

  categoryFilters = [...categoryFilters.filter((f) => f !== categoryId)];

  if (quickFilter.classList.contains('selected')) {
    quickFilter.classList.remove('selected');
    // all filters are de-selected
    if (categoryFilters.length === 0) {
      // clear previous reports
      hazardCardParams['reports'] = [];
      document.querySelector('.btn-report-hazard').style.display = 'flex';
      removePreviousMarkers();
      await getReportApiCall(position.lat, position.lng, categoryFilters);
      return;
    }

    await getReports(position.lat, position.lng, categoryFilters);
    return;
  }

  quickFilter.classList.add('selected');
  categoryFilters.push(categoryId);

  await getReports(position.lat, position.lng, categoryFilters);
};

const getReports = async (lat, lng, categoryFilters = [], cursor = 0) => {
  document.querySelector('.btn-report-hazard').style.display = 'none';
  document.querySelector('.sb-cards')?.remove();
  removePreviousMarkers();

  await getReportApiCall(lat, lng, categoryFilters, cursor);
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
  await getReportApiCall(lat, lng, categoryFilters);

  // update current user position
  position = {
    lat,
    lng,
  };

  if (flyToTrigger) {
    geoMap.map.flyTo([lat, lng], FLY_TO_ZOOM, {
      animate: true,
      duration: ANIMATION_DURATION,
    });
    flyToTrigger = false;
  }
};

const watchGeoLocationError = async (err) => {
  alert.show(`ERROR(${err.code}): ${err.message}`, AlertPopup.error);
  await getReportApiCall(position.lat, position.lng, categoryFilters);
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
  const boxSuggestion = document.querySelector('.sb-suggestion-wrapper');
  const boxCategories = document.querySelector('.sb-categories-wrapper');
  // clear previous search suggestions
  boxSuggestion.innerHTML = '';

  const searchTerm = target?.value;

  if (searchTerm)
    searchSuggestions = await geocode({ searchTerm }, 'autocomplete');
  else searchSuggestions = [];

  if (searchSuggestions.length > 0) {
    // inject search suggestions
    injectHTML(
      searchSuggestions?.map((item) => {
        return {
          func: SearchBarSuggestionCard,
          args: item,
          target: '.sb-suggestion-wrapper',
        };
      }) ?? []
    );

    suggestionOnClick();

    boxSuggestion.style.display = 'block';
    boxCategories.style.display = 'none';
  }
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

document
  .querySelectorAll('.quick-filter')
  .forEach((filter) => filter.addEventListener('click', quickFiltersOnClick));

loadIcons();

// Load Hazard Detail Card
let hazardReportID = '16cde280-ac58-467b-888e-dd0549274b6e';
let currentReport = {};
const body = document.getElementById('home-body');

// Get the report
async function getHazardReport() {
  try {
    const response = await fetch(
      `${API_URL}/hazard-report?id=${hazardReportID}`
    );

    const result = await response.json();
    currentReport = result.data;
  } catch (error) {
    alert.show(
      'Report unavailable at the moment, please try again later or contact support',
      AlertPopup.error
    );
  }
}

// Insert the report
async function displayCurrentReport() {
  await getHazardReport();

  (async () => {
    try {
      let hazardReport = new HazardDetailCard(
        currentReport.id,
        currentReport.hazardCategory.name,
        currentReport.hazard.name,
        currentReport.location.address,
        currentReport.created_at,
        currentReport.images,
        currentReport.comment,
        currentReport.hazardCategory.settings,
        calcHazardDistance(
          currentReport.location.lat,
          currentReport.location.lng,
          Map.watcherLocation.latitude,
          Map.watcherLocation.longitude
        ),
        currentReport.user
      );
      body.insertBefore(hazardReport.hazardCardContent(), body.childNodes[1]);
      loadIcons();
    } catch (error) {
      console.error('Error:', error);
    }
  })();
}

displayCurrentReport();

// Calculate distance from user to hazard with Haversine foruma
function calcHazardDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371;

  const lat1Rad = (lat1 * Math.PI) / 180;
  const lon1Rad = (lon1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const lon2Rad = (lon2 * Math.PI) / 180;

  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance.toFixed(1);
}
