import { API_URL } from '../../constants.js';
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
import HazardDetailCard from '../../assets/components/HazardDetailCard.js';
//Helpers
import injectHTML from '../../assets/helpers/inject-html.js';
import injectHeader from '../../assets/helpers/inject-header.js';
import apiRequest from '../../assets/helpers/api-request.js';
import debounce from '../../assets/helpers/debounce.js';
import geocode from '../../assets/helpers/geocode.js';
import loadIcons from '../../assets/helpers/load-icons.js';
import geolocationDistance from '../../assets/helpers/geolocation-distance.js';
import { getUserSession } from '../../assets/helpers/storage.js';
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

let reports = [];
let positionSecondary = {};
let hazardCardParams = {};
let searchSuggestions = [];
let categoryFilters = [];
let hazardTempFilters = [];
let hazardFilters = [];
let hazardShowCount = 0;
let flyToTrigger = true;

const alert = new AlertPopup();

let mapOptions = {
  zoomControl: false,
  doubleClickZoom: false,
  CURRENT_ZOOM: zoom,
};

let hazardDetail = new HazardReport();
let hazardReportPopulated;

const searchBarParams = {
  categories: [],
};

const user = getUserSession();
const root = document.getElementById('root');

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

    document.getElementById('reportHazardBtn').addEventListener('click', () => {
      if (!user) {
        showLoginModal();
      } else {
        window.location = '/pages/report-hazard';
      }
    });

    document
      .querySelector('.sb-search-box--filter-btn')
      .addEventListener('click', () => toggleFilterModal(false));

    document
      .querySelector('.modal-filter--close-btn')
      .addEventListener('click', () => toggleFilterModal(true));

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

    geoMap = new Map(position.lat, position.lng, mapOptions);
    await getReportApiCall(position.lat, position.lng);

    Map.watchGeoLocation(watchGeoLocationSuccess, watchGeoLocationError);
  } catch (error) {
    console.error(error, error.message);

    alert.show('Error loading categories', AlertPopup.error, 500);
  }

  try {
    if (!idReport) {
      return;
    }
    hazardDetail = await getHazardDetail(idReport);

    if (focusMarker || openDetail) {
      const makerExists = geoMap.checkMarkerOnMap(hazardDetail);

      // marker currently doesnot exists on the map
      if (!makerExists)
        geoMap.createLayerGroups([hazardDetail], markerParams);
      
      flyTo(hazardDetail.location?.lat, hazardDetail.location?.lng);
    }

    if (openDetail) {
      const data = new HazardDetailCard(
        hazardDetail.id,
        hazardDetail.category.name,
        hazardDetail.option.name,
        hazardDetail.location.address,
        hazardDetail.created_at,
        hazardDetail.images,
        hazardDetail.comment,
        hazardDetail.category.settings,
        geolocationDistance(
          hazardDetail.location.lat,
          hazardDetail.location.lng,
          position.lat,
          position.lng
        ),
        hazardDetail.user,
        hazardDetail.flagged_as_fake,
        hazardDetail.enable_reaction
      );

      showHazardDetails(data);

      return;
    }
  } catch (error) {
    console.error(error);
    alert.show(
      error.message || AlertPopup.SOMETHING_WENT_WRONG_MESSAGE,
      AlertPopup.error,
      500
    );
  }
};

const toggleFilterModal = async (flag) => {
  const filterModal = document.querySelector('.modal-filter');
  filterModal.classList.toggle("hidden", flag);

  document.querySelectorAll(".cb").forEach(checkbox => {
    checkbox.addEventListener('change', hazardFilterTempApply, false);
    checkbox.checked = hazardFilters.includes(checkbox.dataset?.id);
    checkbox.classList.toggle("selected", checkbox.checked);
  });

  if(!flag) {
    filterModal.querySelector(".modal-filter--wrapper-outer").scrollTop = 0;
    showReportsBtnStatus(hazardShowCount);
  }

  showReportsBtn?.addEventListener('click', hazardFilterApply, false);
  clearReportsBtn?.addEventListener('click', clearHazardFilter, false);
};

const markerParams =  {
  event: 'click',
  func: async (hazardID) => {
    if (hazardReportPopulated && hazardReportPopulated.parentNode) {
      hazardReportPopulated.parentNode.removeChild(hazardReportPopulated);
    }
    
    const currentReport = await getHazardReportData(hazardID);

    let hazardReport = new HazardDetailCard(
      currentReport.id,
      currentReport.hazardCategory.name,
      currentReport.hazard.name,
      currentReport.location.address,
      currentReport.created_at,
      currentReport.images,
      currentReport.comment,
      currentReport.hazardCategory.settings,
      geolocationDistance(
        currentReport.location.lat,
        currentReport.location.lng,
        position.lat,
        position.lng
      ),
      currentReport.user,
      currentReport.flagged_as_fake,
      currentReport.enable_reaction
    );

    showHazardDetails(hazardReport);
  },
};

const flyTo = (lat, lng) => {
  geoMap.map.flyTo([lat, lng], 12, { animate: true });
};


const closeSearchSuggestion = (e) => {
  const boxSuggestion = document.querySelector('.sb-suggestion-wrapper');
  boxSuggestion.style.display = e?.target?.closest('.sb-search-box')
    ? 'block'
    : 'none';

  document.querySelector('.sb-categories-wrapper').style.display = 'flex';
};

const getReportApiCall = async (lat, lng, size=1000, cursor = 0) => {
  // clear previous markers
  geoMap.mapLayers.clearLayers();
  // clear previous reports
  reports = [];

  const positionChange = searchInput.dataset.positionChange === 'true';
  const url = `hazard-report?cursor=${cursor}&size={size}&lat=${
    positionChange ? positionSecondary.lat : lat
  }&lng=${
    positionChange ? positionSecondary.lng : lng
  }`;

  const res = await apiRequest(url, { method: 'GET' });
  reports = res.data?.results
  hazardCardParams['position'] = position;
  geoMap.createLayerGroups(reports, markerParams);
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

      // change user location
      searchInput.dataset.positionChange = 'true';
      positionSecondary = latLng;
      flyTo(latLng.lat, latLng.lng);
      closeSearchSuggestion();
      await getReportApiCall(latLng.lat, latLng.lng);
      injectCards();
    });
  });
};

const quickFiltersOnClick = async ({ target }) => {
  hazardFilters = [];
  const quickFilter = target.closest('.quick-filter');
  const categoryId = quickFilter.dataset.categoryId;

  categoryFilters = [...categoryFilters.filter((f) => f !== categoryId)];

  if (quickFilter.classList.contains('selected')) {
    quickFilter.classList.remove('selected');
    // all filters are de-selected
    if (categoryFilters.length === 0) {
      geoMap.filterMarker(categoryFilters);
      if (document.querySelector('.sb-cards')) injectCards();
      return;
    }

    geoMap.filterMarker(categoryFilters);
    if (document.querySelector('.sb-cards')) injectCards();
    return;
  }

  quickFilter.classList.add('selected');
  categoryFilters.push(categoryId);

  geoMap.filterMarker(categoryFilters);
  if (document.querySelector('.sb-cards')) injectCards();
};

const injectCards = () => {
  document.querySelector('#reportHazardBtn').style.display = 'none';
  document.querySelector('.sb-cards')?.remove();

  if (categoryFilters.length > 0) {
    hazardCardParams.reports = reports.filter(report => categoryFilters.includes(report.hazardCategory.id));
  } else if (hazardFilters.length > 0) {
    hazardCardParams.reports = reports.filter(report => hazardFilters.includes(report.hazard.id));
  }else {
    hazardCardParams.reports = reports;
  }

  injectHTML([
    { func: HazardCard, args: hazardCardParams, target: '#hazard-comp' },
  ]);

  document.querySelectorAll('.view-details')?.forEach((detailBtn) => {
    detailBtn.addEventListener('click', async ({target}) => {
      const hazardID = target.dataset.id;
      const currentReport = await getHazardReportData(hazardID);

      let hazardReport = new HazardDetailCard(
        currentReport.id,
        currentReport.hazardCategory.name,
        currentReport.hazard.name,
        currentReport.location.address,
        currentReport.created_at,
        currentReport.images,
        currentReport.comment,
        currentReport.hazardCategory.settings,
        geolocationDistance(
          currentReport.location.lat,
          currentReport.location.lng,
          position.lat,
          position.lng
        ),
        currentReport.user,
        currentReport.flagged_as_fake,
        currentReport.enable_reaction
      );

      showHazardDetails(hazardReport);
    });
  });

  loadIcons();
  cardsOnClick();
};


const watchGeoLocationSuccess = async ({ coords }) => {
  const lat = coords?.latitude;
  const lng = coords?.longitude;
  geoMap.setMarkerOnMap(lat, lng);

  // update current user position
  position = {
    lat,
    lng,
  };

  // If there is a report id in the query params and the focus param is set, don't pan to the user's location
  // but to the report's location
  if (flyToTrigger && !(!!idReport && (!!focusMarker || !!openDetail))) {
    await getReportApiCall(lat, lng);
    flyTo(lat, lng);
    flyToTrigger = false;
  }
};

const watchGeoLocationError = async (err) => {
  alert.show(`Unable to access geolocation`, AlertPopup.warning);
  await getReportApiCall(position.lat, position.lng);
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

  if (!searchSuggestions.length) {
    boxSuggestion.style.display = 'none';
    return;
  }

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
});

// Get hazard report from endpoint
async function getHazardReportData(id) {
  try {
    let endpointURL;
    if (!user) {
      endpointURL = `/hazard-report?id=${id}`;
    } else {
      endpointURL = `/hazard-report?id=${id}&user_id=${user.id}`;
    }
    const response = await fetch(API_URL + endpointURL);
    const result = await response.json();
    return result.data;
  } catch (error) {
    alert.show(
      'Reports unavailable at the moment, please try again later or contact support',
      AlertPopup.error
    );
    return null;
  }
}

// Show hazard report
const showHazardDetails = (hazardReport) => {
  try {
    hazardReportPopulated = hazardReport.hazardCardContent();

    root.insertBefore(
      hazardReportPopulated,
      document.getElementById('hazard-comp')
    );

    loadIcons();

    // Close report card
    const reportCloseBtn = document.getElementById('reportCloseBtn');
    reportCloseBtn.addEventListener('click', () => {
      if (hazardReportPopulated.parentNode) {
        hazardReportPopulated.parentNode.removeChild(hazardReportPopulated);
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

const showReportsBtnStatus = (count) => {
  const countNum = Number(count);
  showReportsBtn.disabled = countNum ? false : true;
  showReportsBtn.innerText = `Show ${countNum || ''} reports`;
}

const hazardFilterTempApply = async ({target}) => {
  const hazardId = target?.dataset?.id;
  hazardTempFilters = [...hazardTempFilters.filter((f) => f !== hazardId)];

  if (target?.classList?.contains('selected')) {
    target.classList.remove('selected');
    // all filters are de-selected

    if (hazardTempFilters.length === 0) {
      hazardShowCount = 0
      showReportsBtnStatus(hazardShowCount);
      return;
    }
    hazardShowCount = geoMap.filterMarkerCount(hazardTempFilters);
    showReportsBtnStatus(hazardShowCount);
    return;
  }

  if (!!target) {
    target.classList.add('selected');
    hazardTempFilters.push(hazardId);
  }

  hazardShowCount = geoMap.filterMarkerCount(hazardTempFilters);
  showReportsBtnStatus(hazardShowCount);
}

const hazardFilterApply = async () => {
  // clear all quick filters
  categoryFilters = [];
  document.querySelectorAll('.quick-filter')
    ?.forEach(c => c.classList.remove("selected"));

  hazardFilters = hazardTempFilters;
  geoMap.filterMarker(categoryFilters, hazardFilters);
  if (document.querySelector('.sb-cards')) injectCards();
  toggleFilterModal(true);
}

const clearHazardFilter = async () => {
  categoryFilters = [];
  hazardTempFilters = [];
  hazardFilters = [];
  hazardShowCount = 0;

  // clear checkboxes
  document.querySelectorAll('.cb').forEach(c => {
    c.classList.remove('selected');
    c.checked = false;
  });

  showReportsBtnStatus(0);
  geoMap.filterMarker();
  if (document.querySelector('.sb-cards')) injectCards();
}
