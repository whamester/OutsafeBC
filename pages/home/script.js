//Components
import Header from '../../assets/components/Header.js';
import GeoMap from '../../assets/components/GeoMap.js';
import SearchBar, {
  SearchBarSuggestionCard,
} from '../../assets/components/SearchBar.js';
import Modal from '../../assets/components/Modal.js';
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
import HazardReport from '../../assets/models/HazardReport.js';
import getHazardDetail from '../../assets/helpers/get-hazard-detail.js';

// URL params
const url = new URL(window.location.href);
const idReport = url.searchParams.get('id');
const openDetail = url.searchParams.get('open') === 'true' && !!idReport;
const focusMarker = url.searchParams.get('focus') === 'true' && !!idReport;
const zoom = url.searchParams.get('zoom') ?? 4;
const latitude = Number(url.searchParams.get('lat')) || null;
const longitude = Number(url.searchParams.get('lng')) || null;

//Variable Declaration
let geoMap;
let position =
  latitude && longitude
    ? { lat: latitude, lng: longitude }
    : Map.DEFAULT_LOCATION;

// let positionObj = {};
// let locationDetails = '';
let hazardCardParams = {};
let searchSuggestions = [];
let reports = [];
let categoryFilters = [];
let flyToTrigger = true;
const FLY_TO_ZOOM = 12;
const ANIMATION_DURATION = 4;
const alert = new AlertPopup();

let mapOptions = {
  zoomControl: false,
  doubleClickZoom: false,
  CURRENT_ZOOM: zoom,
};

let hazardDetail = new HazardReport();

const searchBarParams = {
  categories: [],
};

/**
 * Page Init
 */

window.onload = async function () {
  try {
    const { data } = await apiRequest(`hazard-category`, { method: 'GET' });

    searchBarParams.categories = data;

    injectHeader([
      { func: Header, target: '#home-body', position: 'afterbegin' },
    ]);

    injectHTML([
      { func: GeoMap },
      { func: SearchBar, args: searchBarParams },
      { func: ModalFilter, args: searchBarParams.categories },
    ]);

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

    document
      .getElementById('map')
      .addEventListener('click', closeSearchSuggestion);

    document
      .querySelectorAll('.quick-filter')
      .forEach((filter) =>
        filter.addEventListener('click', quickFiltersOnClick)
      );

    loadIcons();

    await loadGeolocation();
  } catch (error) {
    console.error(error);

    alert.show('Error loading categories', AlertPopup.error, 500);
  }

  try {
    if (!idReport) {
      return;
    }
    hazardDetail = await getHazardDetail(idReport);

    if (focusMarker || openDetail) {
      geoMap.createLayerGroups([hazardDetail], markerParams);

      if (
        hazardDetail.location?.lat !== position.lat ||
        hazardDetail.location?.lng !== position.lng
      ) {
        geoMap.map.flyTo(
          [hazardDetail.location?.lat, hazardDetail.location?.lng],
          FLY_TO_ZOOM
        );
      }
    }

    const categories = await apiRequest(`hazard-category`, { method: 'GET' });
  } catch (error) {
    console.error(error);
    alert.show(
      error.message || AlertPopup.SOMETHING_WENT_WRONG_MESSAGE,
      AlertPopup.error,
      500
    );
  }
};

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

      const searchInput = document.querySelector('.sb-search-box--input');
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

  // If there is a report id in the query params and the focus param is set, don't pan to the user's location
  // but to the report's location
  if (flyToTrigger && !(!!idReport && (!!focusMarker || !!openDetail))) {
    geoMap.map.flyTo([lat, lng], FLY_TO_ZOOM);
    flyToTrigger = false;
  }
};

const watchGeoLocationError = async (err) => {
  alert.show(`ERROR(${err.code}): ${err.message}`, AlertPopup.error);
  await getReportApiCall(position.lat, position.lng, categoryFilters);
};

const loadGeolocation = async () => {
  geoMap = new Map(position.lat, position.lng, mapOptions);
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
