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
//Models
import Map from '../../assets/models/Map.js';
//Variable Declaration
let geoMap;
let position = Map.DEFAULT_LOCATION;
let positionSecondary = {};
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
const alert = new AlertPopup();

const categories = await apiRequest(`hazard-category`, { method: 'GET' });

const markerParams = {
  event: 'click',
  func: async (idx, lat, lng) => {
    await getReportApiCall(position.lat, position.lng, categoryFilters);
    injectCards();
    const card = document.getElementById(`sb-card-${idx + 1}`);

    card.scrollIntoView({
      block: 'end',
      behavior: 'smooth',
    });

    flyTo(lat, lng);
  },
};

const flyTo = (lat, lng) => {
  geoMap.map.flyTo([lat, lng], 12, {animate: true});
}

const closeSearchSuggestion = (e) => {
  const boxSuggestion = document.querySelector('.sb-suggestion-wrapper');
  boxSuggestion.style.display = e?.target?.closest('.sb-search-box')
    ? 'block'
    : 'none';

  document.querySelector('.sb-categories-wrapper').style.display = 'flex';
};

const getReportApiCall = async (lat, lng, categoryFilters=[], cursor=0) => {
  // clear previous reports
  hazardCardParams['reports'] = [];
  const url = `hazard-report?cursor=${cursor}&size=1000&lat=${lat}&lan=${lng}&category_ids=${categoryFilters.join(",")}`;
  reports = await apiRequest(url, { method: 'GET' });
  hazardCardParams['reports'] = reports.data?.results;
  geoMap.createLayerGroups(hazardCardParams.reports, markerParams);
};

const cardsOnClick = () => {
  document.querySelectorAll('.sb-cards--item').forEach((card) => {
    card.addEventListener('click', function () {
      const details = JSON.parse(this.dataset.details);
      flyTo(details.location?.lat, details.location?.lng);
    });
  });
};

const suggestionOnClick = () => {
  document.querySelectorAll('.sb-suggestion-item').forEach((card) => {
    card.addEventListener('click', async ({ target }) => {
      const suggestionItem = target.closest('.sb-suggestion-item');

      searchInput.value = suggestionItem?.dataset?.addr1;
      const latLng = JSON.parse(suggestionItem?.dataset?.latlng);

      flyTo(latLng.lat, latLng.lng);
      closeSearchSuggestion();
      await getReportApiCall(latLng.lat, latLng.lng, categoryFilters);
      injectCards();
    });
  });
};

const quickFiltersOnClick = async({ target }) => {
  geoMap.mapLayers.clearLayers();
  const quickFilter = target.closest('.quick-filter');
  const categoryId = quickFilter.dataset.categoryId;

  categoryFilters = [
    ...categoryFilters.filter((f) => f !== categoryId)
  ];

  if (quickFilter.classList.contains('selected')) {
    quickFilter.classList.remove('selected');
    // all filters are de-selected
    if (categoryFilters.length === 0) {
      await getReportApiCall(position.lat, position.lng, categoryFilters);
      if (document.querySelector('.sb-cards')) injectCards();
      return;
    }

    await getReportApiCall(position.lat, position.lng, categoryFilters);
    if (document.querySelector('.sb-cards')) injectCards();
    return;
  }

  quickFilter.classList.add('selected');
  categoryFilters.push(categoryId);

  await getReportApiCall(position.lat, position.lng, categoryFilters);
  if (document.querySelector('.sb-cards')) injectCards();
}

const injectCards = () => {
  document.querySelector('.btn-report-hazard').style.display = 'none';
  document.querySelector('.sb-cards')?.remove();

  injectHTML([
    { func: HazardCard, args: hazardCardParams, target: '#hazard-comp' },
  ]);

  loadIcons();
  cardsOnClick();
}

const watchGeoLocationSuccess = async ({ coords }) => {
  const lat = coords?.latitude;
  const lng = coords?.longitude;
  geoMap.setMarkerOnMap(lat, lng);
  await getReportApiCall(lat, lng, categoryFilters);

  // update current user position 
  position = {
    lat,
    lng
  }

  if (flyToTrigger) {
    flyTo(lat, lng);
    flyToTrigger = false;
  }
};

const watchGeoLocationError = async (err) => {
  console.error(`ERROR(${err.code}): ${err.message}`);
  alert.show(
    `Error while trying to get location`,
    AlertPopup.error
  );
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

  if(searchSuggestions.length > 0) {
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
  } else {
    boxSuggestion.style.display = 'none';
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
  .addEventListener('input', onSearchInput);

document
  .querySelector('.sb-search-box--input')
  .addEventListener('focus', (e) => {
    onSearchInput(e);
    e.target.select();
  });

document.getElementById('map').addEventListener('click', closeSearchSuggestion);

document.querySelectorAll('.quick-filter')
  .forEach((filter) => filter.addEventListener('click', quickFiltersOnClick));

loadIcons();
