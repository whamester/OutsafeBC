import { API_URL } from '../../constants.js';
//Components
import Header from '../../assets/components/Header.js';
import GeoMap from '../../assets/components/GeoMap.js';
import SearchBar, { SearchBarSuggestionCard } from '../../assets/components/SearchBar.js';
import HazardCardLayout from '../../assets/components/HazardCardLayout.js';
import ModalFilter from '../../assets/components/ModalFilter.js';
import AlertPopup from '../../assets/components/AlertPopup.js';
import HazardDetailCard from '../../assets/components/HazardDetailCard.js';
import showLoginModal from '../../assets/helpers/showLoginModal.js';
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
const zoom = parseInt(url.searchParams.get('zoom')) || 12;
const latitude = Number(url.searchParams.get('lat')) || null;
const longitude = Number(url.searchParams.get('lng')) || null;

//Variable Declaration
let geoMap;
let position = latitude && longitude ? { lat: latitude, lng: longitude } : Map.DEFAULT_LOCATION;

let reports = [];
let positionSecondary = {};
let hazardCardParams = {};
let searchSuggestions = [];
let categoryFilters = [];
let hazardTempFilters = [];
let hazardFilters = [];
let hazardShowCount = 0;
let flyToTrigger = true;

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

    injectHeader([{ func: Header, target: '#home-body', position: 'afterbegin' }]);

    injectHTML([{ func: GeoMap }, { func: SearchBar, args: searchBarParams }, { func: ModalFilter, args: searchBarParams.categories }]);

    document.getElementById('reportHazardBtn').addEventListener('click', () => {
      if (!user) {
        showLoginModal();
      } else {
        window.location = `/pages/report-hazard/index.html?lat=${position.lat}&lng=${position.lng}`;
      }
    });

    document.querySelector('.sb-search-box--filter-btn').addEventListener('click', () => toggleFilterModal(false));

    document.querySelector('.modal-filter--close-btn').addEventListener('click', () => toggleFilterModal(true));

    document.querySelector('#closeBtnDesktop').addEventListener('click', () => toggleFilterModal(true));

    document.querySelector('.sb-search-box--input').addEventListener('input', (e) => onSearchInput(e));

    document.querySelector('.sb-search-box--input').addEventListener('focus', (e) => {
      onSearchInput(e);
      e.target.select();
    });

    document.getElementById('map').addEventListener('click', closeSearchSuggestion);

    document.querySelectorAll('.quick-filter').forEach((filter) => filter.addEventListener('click', quickFiltersOnClick));

    document.querySelector('.map-controls-recenter-btn').addEventListener('click', () => {
      flyTo(position.lat, position.lng);
    });

    mapZoomIn.addEventListener('click', () => geoMap.map.zoomIn());
    mapZoomOut.addEventListener('click', () => geoMap.map.zoomOut());

    loadIcons();

    geoMap = new Map(position.lat, position.lng, mapOptions);
    await getReportApiCall(position.lat, position.lng);

    Map.watchGeoLocation(watchGeoLocationSuccess, watchGeoLocationError);

    // clear recenter btn focus
    geoMap.map.on('drag', () => recenterBtn?.blur());
  } catch (error) {
    console.error(error, error.message);

    AlertPopup.show('Error loading categories', AlertPopup.error, 500);
  }

  try {
    if (!idReport) {
      return;
    }
    hazardDetail = await getHazardDetail(idReport);

    if (focusMarker || openDetail) {
      const makerExists = geoMap.checkMarkerOnMap(hazardDetail);

      // marker currently doesnot exists on the map
      if (!makerExists) geoMap.createLayerGroups([{ ...hazardDetail, hazardCategory: hazardDetail.category, hazard: hazardDetail.option }], {...markerParams, focus: true});

      flyTo(hazardDetail.location?.lat, hazardDetail.location?.lng);
    }

    if (openDetail) {
      // id, category, hazard, location, date, photos, comment, settings,flagged_count, not_there_count,still_there_count
      // distance, user, flagged_as_fake, enable_reaction
      const data = new HazardDetailCard({
        id: hazardDetail.id,
        category: hazardDetail.category.name,
        hazard: hazardDetail.option.name,
        location: hazardDetail.location.address,
        lat: hazardDetail.location.lat,
        lng: hazardDetail.location.lng,
        photos: hazardDetail.images,
        comment: hazardDetail.comment,
        settings: hazardDetail.category.settings,
        flagged_count: hazardDetail.flagged_count,
        not_there_count: hazardDetail.not_there_count,
        still_there_count: hazardDetail.still_there_count,
        flagged_as_fake: hazardDetail.flagged_as_fake,
        enable_reaction: hazardDetail.enable_reaction,
        created_at: hazardDetail.created_at,
        updated_at: hazardDetail.updated_at,
        deleted_at: hazardDetail.deleted_at,
        distance: geolocationDistance(hazardDetail.location.lat, hazardDetail.location.lng, position.lat, position.lng),
        user: hazardDetail.user,
      });

      showHazardDetails(data);

      return;
    }
  } catch (error) {
    console.error(error);
    AlertPopup.show(error.message || AlertPopup.SOMETHING_WENT_WRONG_MESSAGE, AlertPopup.error, 500);
  }
};

const toggleFilterModal = async (flag) => {
  const filterModal = document.querySelector('.modal-filter');
  filterModal.classList.toggle('hidden', flag);

  document.querySelectorAll('.cb').forEach((checkbox) => {
    checkbox.addEventListener('change', hazardFilterTempApply, false);
    checkbox.checked = hazardFilters.includes(checkbox.dataset?.id);
    checkbox.classList.toggle('selected', checkbox.checked);
  });

  if (!flag) {
    hazardShowCount = geoMap.filterMarkerCount(hazardFilters);
    filterModal.querySelector('.modal-filter--wrapper-outer').scrollTop = 0;
    showReportsBtnStatus(hazardShowCount);
  }

  showReportsBtn?.addEventListener('click', hazardFilterApply, false);
  clearReportsBtn?.addEventListener('click', clearHazardFilter, false);

  let countTag = filterBtn.querySelector('#hazardFilterCountTag');
  filterBtn.classList.remove('selected');

  if (!countTag) {
    countTag = document.createElement('p');
  }

  if (hazardFilters.length > 0) {
    countTag.innerText = hazardFilters.length;
    filterBtn.classList.add('selected');
    countTag.setAttribute('id', 'hazardFilterCountTag');
    filterBtn.appendChild(countTag);
  } else {
    countTag.remove();
  }
};

const markerParams = {
  event: 'click',
  func: async (hazardID) => {
    if (hazardReportPopulated && hazardReportPopulated.parentNode) {
      hazardReportPopulated.parentNode.removeChild(hazardReportPopulated);
    }

    const currentReport = await getHazardReportData(hazardID);

    let hazardReport = new HazardDetailCard({
      id: currentReport.id,
      category: currentReport.hazardCategory.name,
      hazard: currentReport.hazard.name,
      location: currentReport.location.address,
      lat: hazardDetail.location.lat,
      lng: hazardDetail.location.lng,
      photos: currentReport.images,
      comment: currentReport.comment,
      settings: currentReport.hazardCategory.settings,
      flagged_count: currentReport.flagged_count,
      not_there_count: currentReport.not_there_count,
      still_there_count: currentReport.still_there_count,
      flagged_as_fake: currentReport.flagged_as_fake,
      enable_reaction: currentReport.enable_reaction,
      created_at: currentReport.created_at,
      updated_at: currentReport.updated_at,
      deleted_at: currentReport.deleted_at,
      distance: geolocationDistance(currentReport.location.lat, currentReport.location.lng, position.lat, position.lng),
      user: currentReport.user,
    });

    changeActiveMarkerIcon(currentReport.location.lat, currentReport.location.lng);
    showHazardDetails(hazardReport);
    flyTo(currentReport.location.lat, currentReport.location.lng);
  },
};

const flyTo = (lat, lng) => {
  geoMap.map.flyTo([lat, lng], 12, { animate: true });
};

const closeSearchSuggestion = (e) => {
  const boxSuggestion = document.querySelector('.sb-suggestion-wrapper');
  boxSuggestion.style.display = e?.target?.closest('.sb-search-box') ? 'block' : 'none';

  document.querySelector('.sb-categories-wrapper').style.display = 'flex';
};

const getReportApiCall = async (lat, lng) => {
  // clear previous markers
  geoMap.mapLayers.clearLayers();
  // clear previous reports
  reports = [];

  // search position
  const positionChange = searchInput.dataset.positionChange === 'true';

  const url = `hazard-report?lat=${positionChange ? positionSecondary.lat : lat}&lng=${positionChange ? positionSecondary.lng : lng}&type=recent&active_only=true`;

  const res = await apiRequest(url, { method: 'GET' });
  reports = res.data?.results;
  hazardCardParams.position = position;

  geoMap.createLayerGroups(reports, markerParams);
  if (hazardFilters.length > 0) {
    geoMap.filterMarker(categoryFilters, hazardFilters);
  } else if (categoryFilters.length > 0) {
    geoMap.filterMarker(categoryFilters);
  }
};

const changeActiveMarkerIcon = (lat, lng) => {
  for(const marker of geoMap.mapLayers.getLayers()) {
    const mCoords = marker.getLatLng();
    if (marker.active) {
      marker.setIcon(Map.createIcon({iconName: marker.icon_name}));
      marker.setZIndexOffset(null);
      marker.active = false;
    }

    if(lat === mCoords.lat && lng === mCoords.lng) {
      marker.setIcon(Map.createIcon({iconName: marker.icon_name_focused}));
      marker.setZIndexOffset(1000);
      marker.active = true;
    }
  }
}

const cardsOnClick = () => {
  document.querySelectorAll('.sb-cards--item').forEach((card) => {
    card.addEventListener('click', function () {
      const details = JSON.parse(this.dataset.details);
      flyTo(details.location?.lat, details.location?.lng);
      changeActiveMarkerIcon(details.location?.lat, details.location?.lng);
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
      geoMap.setRelativeMarkerOnMap(latLng.lat, latLng.lng);
      closeSearchSuggestion();
      await getReportApiCall(latLng.lat, latLng.lng, categoryFilters, hazardFilters);
      injectCards();
    });
  });
};

const quickFiltersOnClick = async ({ target }) => {
  hazardFilters = [];
  hazardTempFilters = [];
  filterBtn.classList.remove('selected');
  const hazardFilterCountTag = document.getElementById('hazardFilterCountTag');

  if (hazardFilterCountTag) hazardFilterCountTag.remove();

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
    hazardCardParams.reports = reports.filter((report) => categoryFilters.includes(report.hazardCategory.id));
  } else if (hazardFilters.length > 0) {
    hazardCardParams.reports = reports.filter((report) => hazardFilters.includes(report.hazard.id));
  } else {
    hazardCardParams.reports = reports;
  }

  injectHTML([{ func: HazardCardLayout, args: hazardCardParams, target: '#hazard-comp' }]);

  document.querySelector('.sb-cards-btn--back').addEventListener('click', () => {
    document.querySelector('.sb-cards').remove(); document.querySelector('.btn-report-hazard').style.display = 'flex'; 
    searchInput.dataset.positionChange='false';
    searchInput.value='';
    geoMap.setRelativeMarkerOnMap(0, 0, {removeOnly: true});
  }, false);

  document.querySelectorAll('.view-details')?.forEach((detailBtn) => {
    detailBtn.addEventListener('click', async ({ target }) => {
      const hazardID = target.dataset.id;
      hazardDetail = await getHazardDetail(hazardID);

      const data = new HazardDetailCard({
        id: hazardDetail.id,
        category: hazardDetail.category.name,
        hazard: hazardDetail.option.name,
        location: hazardDetail.location.address,
        lat: hazardDetail.location.lat,
        lng: hazardDetail.location.lng,
        photos: hazardDetail.images,
        comment: hazardDetail.comment,
        settings: hazardDetail.category.settings,
        flagged_count: hazardDetail.flagged_count,
        not_there_count: hazardDetail.not_there_count,
        still_there_count: hazardDetail.still_there_count,
        flagged_as_fake: hazardDetail.flagged_as_fake,
        enable_reaction: hazardDetail.enable_reaction,
        created_at: hazardDetail.created_at,
        updated_at: hazardDetail.updated_at,
        deleted_at: hazardDetail.deleted_at,
        distance: geolocationDistance(hazardDetail.location.lat, hazardDetail.location.lng, position.lat, position.lng),
        user: hazardDetail.user,
      });

      showHazardDetails(data);
    });
  });

  loadIcons();
  cardsOnClick();
};

const watchGeoLocationSuccess = async ({ coords }) => {
  const lat = coords?.latitude;
  const lng = coords?.longitude;
  geoMap.setMarkerOnMap(lat, lng, {icon: 'current-location-map-pin.svg'});

  // If there is a report id in the query params and the focus param is set, don't pan to the user's location
  // but to the report's location
  if (flyToTrigger && !(!!idReport && (!!focusMarker || !!openDetail))) {
    // update current user position
    position = {
      lat,
      lng,
    };

    await getReportApiCall(lat, lng);
    flyTo(lat, lng);
    recenterBtn.focus();
    flyToTrigger = false;
  }

  const distanceDiff = geolocationDistance(lat, lng, position.lat, position.lng);

  // if user moves more than 25Km's
  // change his current position to get new reports
  if (distanceDiff > 25) {
    position = {
      lat,
      lng,
    };
  }
};

const watchGeoLocationError = async (err) => {
  // AlertPopup.show(`Unable to access geolocation`, AlertPopup.warning);
  await getReportApiCall(position.lat, position.lng);
};

const onSearchInput = debounce(async ({ target }) => {
  const boxSuggestion = document.querySelector('.sb-suggestion-wrapper');
  const boxCategories = document.querySelector('.sb-categories-wrapper');
  // clear previous search suggestions
  boxSuggestion.innerHTML = '';

  const searchTerm = target?.value;

  if (searchTerm) searchSuggestions = await geocode({ searchTerm }, 'autocomplete');
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
    AlertPopup.show('Reports unavailable at the moment, please try again later or contact support', AlertPopup.error);
    return null;
  }
}

// Show hazard report
const showHazardDetails = (hazardReport) => {
  try {
    hazardReportPopulated = hazardReport.hazardCardContent();

    root.appendChild(hazardReportPopulated, document.getElementById('hazard-comp'));

    const cardBackBtn = document.querySelector('.sb-cards-btn--back');
    if(cardBackBtn) cardBackBtn.style.display = 'none';

    loadIcons();

    // Close report card
    const reportShareBtn = document.getElementById('reportShareBtn');

    const baseUrl = window.location.origin;
    const url = baseUrl + `/pages/home/index.html?id=${hazardReport.id}&focus=true&open=true&zoom=12&lat=${hazardReport.lat}&lng=${hazardReport.lng}`;

    reportShareBtn.addEventListener("click", async () => {
      try {
        const data = {
          title: hazardReport.hazard,
          text: hazardReport.location,
          url,
        };
        await navigator.share(data);
      } catch (err) {
        console.error('Share error: ', err);

        try {
          await navigator.clipboard.writeText(url);
          AlertPopup.show('Link Copied!', AlertPopup.success);
        } catch (err) {
          console.error('Clipboard error: ', err);
        }
      }
    }, false);

    const reportCloseBtn = document.getElementById('reportCloseBtn');
    reportCloseBtn.addEventListener('click', () => {
      if (hazardReportPopulated.parentNode) {
        hazardReportPopulated.parentNode.removeChild(hazardReportPopulated);
      }
      if (cardBackBtn) cardBackBtn.style.display = 'flex';
      changeActiveMarkerIcon(0, 0);
    });

    //

    // Bottom sheet
    const content = document.querySelector('#hazard-card__outer');
    let windowWidth = window.matchMedia('(min-width: 768px)');

    let updateHeight = (height) => {
      //updating sheet height
      content.style.height = `${height}vh`;
    };

    function mediaQueryCheck(windowWidth) {
      if (windowWidth.matches) {
        reportShareBtn.style.display = 'flex';
        reportCloseBtn.style.display = 'flex';
        // content.style.height = 'fit-content';
      } else {
        reportShareBtn.style.display = 'none';
        reportCloseBtn.style.display = 'none';
        // Set initial height
        // updateHeight(40);

        let isDragging = false,
          startY,
          startHeight;

        let dragStart = (e) => {
          isDragging = true;

          //recording intitial y position and sheet height
          startY = e.pageY || e.touches?.[0].pageY;
          startHeight = parseInt(content.style.height);
        };

        let dragging = (e) => {
          //return if isDragging is false
          if (!isDragging) return;

          //calculating new height of sheet by using starty and start height
          let delta = startY - (e.pageY || e.touches?.[0].pageY);
          let newHeight = startHeight + (delta / window.innerHeight) * 100;

          //calling updateHeight function with new height as argument
          updateHeight(newHeight);
        };

        let dragStop = () => {
          isDragging = false;

          //setting sheet height based on the sheet current height or position
          let sheetHeight = parseInt(content.style.height);

          //if height is greater than 75 making sheet full screen else making it to 50vh
          sheetHeight < 20 ? closeSheet() : sheetHeight > 55 ? maxHeight(90) : minHeight(40);
        };

        let minHeight = (min) => {
          updateHeight(min);
          reportShareBtn.style.display = 'none';
          reportCloseBtn.style.display = 'none';
        };

        let maxHeight = (max) => {
          updateHeight(max);
          reportShareBtn.style.display = 'flex';
          reportCloseBtn.style.display = 'flex';
        };

        let closeSheet = () => {
          // Close the report card using removeChild
          if (hazardReportPopulated.parentNode) {
            hazardReportPopulated.parentNode.removeChild(hazardReportPopulated);
            if (cardBackBtn) cardBackBtn.style.display = 'flex';
            changeActiveMarkerIcon(0, 0);
          }
        };

        content.addEventListener('mousedown', dragStart);
        content.addEventListener('mousemove', dragging);
        content.addEventListener('mouseup', dragStop);

        content.addEventListener('touchstart', dragStart);
        content.addEventListener('touchmove', dragging);
        content.addEventListener('touchend', dragStop);
      }
    }
    mediaQueryCheck(windowWidth);
    windowWidth.addListener(mediaQueryCheck);
  } catch (error) {
    console.error('Error:', error);
  }
};

const showReportsBtnStatus = (count) => {
  const countNum = Number(count);
  showReportsBtn.disabled = countNum ? false : true;
  showReportsBtn.innerText = `Show ${countNum || ''} reports`;
};

const hazardFilterTempApply = async ({ target }) => {
  const hazardId = target?.dataset?.id;
  hazardTempFilters = [...hazardTempFilters.filter((f) => f !== hazardId)];

  if (target?.classList?.contains('selected')) {
    target.classList.remove('selected');
    // all filters are de-selected

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
};

const hazardFilterApply = async () => {
  // clear all quick filters
  categoryFilters = [];
  document.querySelectorAll('.quick-filter')?.forEach((c) => c.classList.remove('selected'));

  hazardFilters = hazardTempFilters;
  geoMap.filterMarker(categoryFilters, hazardFilters);
  if (document.querySelector('.sb-cards')) injectCards();
  toggleFilterModal(true);
};

const clearHazardFilter = async () => {
  categoryFilters = [];
  hazardTempFilters = [];
  hazardFilters = [];
  hazardShowCount = 0;

  // clear checkboxes
  document.querySelectorAll('.cb').forEach((c) => {
    c.classList.remove('selected');
    c.checked = false;
  });

  hazardShowCount = geoMap.filterMarkerCount(hazardTempFilters);
  showReportsBtnStatus(hazardShowCount);
  geoMap.filterMarker([], hazardFilters);
  if (document.querySelector('.sb-cards')) injectCards();
};
